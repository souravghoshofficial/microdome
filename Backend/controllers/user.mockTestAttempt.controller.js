import { MockTest } from "../models/mockTest.model.js";
import { MockTestAttempt } from "../models/mockTestAttempt.model.js";
import { MockTestAnswer } from "../models/mockTestAnswers.model.js";
import { MockTestQuestion } from "../models/mockTestQuestion.model.js";
import { MockTestSection } from "../models/mockTestSection.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { MockTestResult } from "../models/mockTestResult.model.js";
// ===============================
// helper: compute remaining
// ===============================
const computeRemainingSeconds = (attempt) => {
  const now = Date.now();
  const elapsed = Math.floor((now - attempt.startedAt.getTime()) / 1000);
  return attempt.durationSeconds - elapsed;
};

function computeSectionMaxScore(section) {
  const questions = section.questions || [];
  if (!questions.length) return 0;

  // Choice section (attempt N out of M)
  if (section.questionsToAttempt !== null) {
    const marksPerQ = questions[0].marks; // guaranteed equal
    return section.questionsToAttempt * marksPerQ;
  }

  // Full section
  return questions.reduce((sum, q) => sum + (q.marks || 0), 0);
}

// ===============================
// helper: evaluate attempt
// ===============================

const evaluateAttempt = async (attemptId) => {
  const attempt = await MockTestAttempt.findById(attemptId).lean();
  if (!attempt) throw new Error("Attempt not found");

  const answers = await MockTestAnswer.find({ attemptId }).lean();

  const questions = await MockTestQuestion.find({
    mockTestId: attempt.mockTestId,
  }).lean();

  const sections = await MockTestSection.find({
    mockTestId: attempt.mockTestId,
  }).lean();

  // ===============================
  // Build Question Map
  // ===============================
  const questionMap = {};
  questions.forEach((q) => {
    questionMap[q._id.toString()] = q;
  });

  // ===============================
  // Group Questions Section-wise
  // ===============================
  const sectionQuestionMap = {};
  sections.forEach((section) => {
    sectionQuestionMap[section._id.toString()] = questions
      .filter((q) => q.mockTestSectionId.toString() === section._id.toString())
      .sort((a, b) => a.questionOrder - b.questionOrder);
  });

  // ===============================
  // Group Answers Section-wise
  // ===============================
  const sectionAnswerMap = {};

  answers.forEach((ans) => {
    const question = questionMap[ans.questionId.toString()];
    if (!question) return;

    const sectionId = question.mockTestSectionId.toString();

    if (!sectionAnswerMap[sectionId]) {
      sectionAnswerMap[sectionId] = [];
    }

    if (ans.isAnswered) {
      sectionAnswerMap[sectionId].push(ans);
    }
  });

  // Sort answers by question order
  Object.keys(sectionAnswerMap).forEach((sectionId) => {
    sectionAnswerMap[sectionId].sort((a, b) => {
      const qa = questionMap[a.questionId.toString()];
      const qb = questionMap[b.questionId.toString()];
      return qa.questionOrder - qb.questionOrder;
    });
  });

  // ===============================
  // Determine Valid Answers (Section Limit Logic)
  // ===============================
  const validAnswerIds = new Set();

  sections.forEach((section) => {
    const sectionId = section._id.toString();
    const sectionAnswers = sectionAnswerMap[sectionId] || [];

    if (section.questionsToAttempt !== null) {
      const allowedAnswers = sectionAnswers.slice(
        0,
        section.questionsToAttempt,
      );
      allowedAnswers.forEach((a) => validAnswerIds.add(a._id.toString()));
    } else {
      sectionAnswers.forEach((a) => validAnswerIds.add(a._id.toString()));
    }
  });

  // ===============================
  // SCORING
  // ===============================
  let totalScore = 0;
  let correct = 0;
  let wrong = 0;

  const attemptedQuestionIds = new Set();

  for (const answer of answers) {
    if (!answer.isAnswered) continue;

    const question = questionMap[answer.questionId.toString()];
    if (!question) continue;

    // Ignore answers beyond section limit
    if (!validAnswerIds.has(answer._id.toString())) {
      continue;
    }

    attemptedQuestionIds.add(answer.questionId.toString());

    let isCorrect = false;

    // =====================
    // MCQ
    // =====================
    if (question.questionType === "MCQ") {
      if (
        answer.selectedOptions.length === 1 &&
        answer.selectedOptions[0] === question.correctAnswer[0]
      ) {
        isCorrect = true;
      }
    }

    // =====================
    // MSQ (Exact match)
    // =====================
    if (question.questionType === "MSQ") {
      const selected = [...answer.selectedOptions].sort();
      const correctAns = [...question.correctAnswer].sort();

      if (JSON.stringify(selected) === JSON.stringify(correctAns)) {
        isCorrect = true;
      }
    }

    // =====================
    // NAT (With tolerance)
    // =====================
    if (question.questionType === "NAT") {
      if (question.numericAnswer !== null && answer.numericAnswer !== null) {
        const diff = Math.abs(answer.numericAnswer - question.numericAnswer);

        if (question.tolerance !== null) {
          if (diff <= question.tolerance) {
            isCorrect = true;
          }
        } else {
          if (answer.numericAnswer === question.numericAnswer) {
            isCorrect = true;
          }
        }
      }
    }

    if (isCorrect) {
      totalScore += question.marks;
      correct++;
    } else {
      totalScore -= question.negativeMarks || 0;
      wrong++;
    }
  }

  // ===============================
  // FINAL COUNTS
  // ===============================
  const totalQuestions = questions.length;
  const attemptedCount = attemptedQuestionIds.size;
  const skipped = totalQuestions - attemptedCount;

  return {
    totalScore,
    correct,
    wrong,
    skipped,
  };
};

// ===============================
// START / RESUME
// ===============================
export const startMockTestAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mockTestId } = req.params;

    const mockTest = await MockTest.findById(mockTestId)
      .select("-instructions")
      .lean();

    if (!mockTest || mockTest.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Mock test not found" });
    }

    const durationSeconds = mockTest.durationMinutes * 60;

    // =============================
    // RESUME EXISTING IN_PROGRESS
    // =============================
    const latestInProgress = await MockTestAttempt.findOne({
      userId,
      mockTestId,
      status: "IN_PROGRESS",
    }).sort({ attemptNumber: -1 });

    if (latestInProgress) {
      const remaining = computeRemainingSeconds(latestInProgress);

      if (remaining > 0) {
        return res.json({
          attemptId: latestInProgress._id,
          mockTest,
          resume: true,
          startedAt: latestInProgress.startedAt,
          durationSeconds: latestInProgress.durationSeconds,
          remainingSeconds: remaining,
        });
      }

      // expire it safely once
      if (latestInProgress.status === "IN_PROGRESS") {
        latestInProgress.status = "EXPIRED";
        latestInProgress.submittedAt = new Date(
          latestInProgress.startedAt.getTime() +
            latestInProgress.durationSeconds * 1000,
        );
        await latestInProgress.save();

        const result = await evaluateAttempt(latestInProgress._id);

        await MockTestResult.create({
          attemptId: latestInProgress._id,
          userId: latestInProgress.userId,
          mockTestId: latestInProgress.mockTestId,
          bundleId: latestInProgress.bundleId || null,
          attemptNumber: latestInProgress.attemptNumber,
          timeTakenSeconds: latestInProgress.durationSeconds,
          score: result.totalScore,
          correctCount: result.correct,
          incorrectCount: result.wrong,
          unattemptedCount: result.skipped,
        });

        return res.json({
          expired: true,
          attemptId: latestInProgress._id,
          mockTest,
        });
      }
    }

    // =============================
    // CREATE NEW ATTEMPT (SAFE)
    // =============================
    let attemptDoc;
    let retries = 3;

    while (retries > 0) {
      // get latest number
      const latest = await MockTestAttempt.findOne({
        userId,
        mockTestId,
      }).sort({ attemptNumber: -1 });

      const nextAttempt = (latest?.attemptNumber || 0) + 1;

      if (nextAttempt > mockTest.allowedAttempts) {
        return res.status(403).json({ message: "No attempts remaining" });
      }

      try {
        attemptDoc = await MockTestAttempt.create({
          userId,
          mockTestId,
          bundleId: mockTest.bundleId,
          attemptNumber: nextAttempt,
          durationSeconds,
        });

        break; // success
      } catch (err) {
        // duplicate attemptNumber race → retry
        if (err.code === 11000) {
          retries--;
          if (retries === 0) throw err;
          continue;
        }
        throw err;
      }
    }

    return res.json({
      attemptId: attemptDoc._id,
      mockTest,
      resume: false,
      startedAt: attemptDoc.startedAt,
      durationSeconds,
      remainingSeconds: durationSeconds,
    });
  } catch (err) {
    console.error("Start attempt error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMockTestAttemptSession = async (req, res) => {
  try {
    const { attemptId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ message: "Invalid attemptId" });
    }

    const attempt =
      await MockTestAttempt.findById(attemptId).populate("mockTestId");

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // sections
    const sections = await MockTestSection.find({
      mockTestId: attempt.mockTestId,
    }).sort({ sectionOrder: 1 });

    // questions
    const questions = await MockTestQuestion.find({
      mockTestId: attempt.mockTestId,
    }).sort({ questionOrder: 1 });

    // answers
    const answers = await MockTestAnswer.find({
      attemptId,
    });

    // map answers by questionId
    const ansMap = {};
    answers.forEach((a) => {
      ansMap[a.questionId.toString()] = a;
    });

    // merge questions into sections with state
    const sectionMap = {};

    sections.forEach((s) => {
      sectionMap[s._id] = {
        sectionId: s._id,
        sectionTitle: s.title,
        questionType: s.questionType,
        questionsToAttempt: s.questionsToAttempt,
        questions: [],
      };
    });

    questions.forEach((q) => {
      const a = ansMap[q._id.toString()];

      const state = {
        isVisited: a?.isVisited || false,
        isAnswered: a?.isAnswered || false,
        isMarkedForReview: a?.isMarkedForReview || false,
        selectedOptions: a?.selectedOptions || [],
        numericAnswer: a?.numericAnswer ?? null,
      };

      sectionMap[q.mockTestSectionId].questions.push({
        _id: q._id,
        questionText: q.questionText,
        questionType: q.questionType,
        questionImageUrl: q.questionImageUrl,
        options: q.options,
        marks: q.marks,
        negativeMarks: q.negativeMarks,
        questionOrder: q.questionOrder,
        state,
      });
    });

    return res.json({
      attemptId: attempt._id,
      mockTest: attempt.mockTestId,
      startedAt: attempt.startedAt,
      durationSeconds: attempt.mockTestId.durationMinutes * 60,
      sections: Object.values(sectionMap),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markVisited = async (req, res) => {
  try {
    const { attemptId, questionId } = req.params;

    await MockTestAnswer.findOneAndUpdate(
      { attemptId, questionId },
      { isVisited: true },
      { upsert: true, new: true },
    );

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const saveAnswer = async (req, res) => {
  try {
    const { attemptId, questionId } = req.params;
    const { questionType, selectedOptions, numericAnswer, isMarkedForReview } =
      req.body;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(attemptId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    let updateData = {
      questionType,
      isMarkedForReview: isMarkedForReview ?? false,
      isVisited: true,
    };

    let isAnswered = false;

    // MCQ / MSQ logic
    if (questionType === "MCQ" || questionType === "MSQ") {
      const options = Array.isArray(selectedOptions) ? selectedOptions : [];

      updateData.selectedOptions = options;
      updateData.numericAnswer = null;

      // Determine if answered
      if (options.length > 0) {
        isAnswered = true;
      }
    }

    // NAT logic
    if (questionType === "NAT") {
      const value =
        numericAnswer !== undefined && numericAnswer !== null
          ? Number(numericAnswer)
          : null;

      updateData.numericAnswer = value;
      updateData.selectedOptions = [];

      // Determine if answered
      if (value !== null && !isNaN(value)) {
        isAnswered = true;
      }
    }

    updateData.isAnswered = isAnswered;

    const answer = await MockTestAnswer.findOneAndUpdate(
      { attemptId, questionId },
      updateData,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      message: isAnswered
        ? "Answer saved successfully"
        : "Answer cleared successfully",
      answer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const submitMockTest = async (req, res) => {
  try {
    const { attemptId } = req.params;

    /* =============================
       FETCH ATTEMPT
    ============================= */
    const attempt = await MockTestAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    if (attempt.status === "SUBMITTED") {
      return res.status(400).json({
        message: "Test already submitted",
      });
    }

    if (attempt.status === "EXPIRED") {
      return res.status(400).json({
        message: "Test already expired",
      });
    }

    /* =============================
       EVALUATE
    ============================= */
    const evaluation = await evaluateAttempt(attemptId);

    /* =============================
       TIME TAKEN (server-accurate)
    ============================= */
    const submittedAt = new Date();

    const rawSeconds =
      (submittedAt.getTime() - attempt.startedAt.getTime()) / 1000;

    // clamp to allowed duration
    const timeTakenSeconds = Math.max(
      0,
      Math.min(Math.floor(rawSeconds), attempt.durationSeconds),
    );

    /* =============================
       UPDATE ATTEMPT
    ============================= */
    attempt.status = "SUBMITTED";
    attempt.submittedAt = submittedAt;
    await attempt.save();

    /* =============================
       SAVE RESULT
    ============================= */
    const resultDoc = await MockTestResult.create({
      attemptId: attempt._id,
      userId: attempt.userId,
      mockTestId: attempt.mockTestId,
      bundleId: attempt.bundleId || null,

      attemptNumber: attempt.attemptNumber,
      timeTakenSeconds,

      score: evaluation.totalScore,
      correctCount: evaluation.correct,
      incorrectCount: evaluation.wrong,
      unattemptedCount: evaluation.skipped,
    });

    return res.status(200).json({
      message: "Mock test submitted successfully",
      result: resultDoc,
    });
  } catch (error) {
    console.error("submitMockTest error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAttemptResult = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const { attempt: attemptQuery } = req.query;
    const userId = req.user._id;

    /* ---------- validate ---------- */
    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        message: "Invalid mock test id",
      });
    }

    /* ===============================
       FETCH MOCK TEST META
    =============================== */
    const mockTest = await MockTest.findById(mockTestId)
      .select("title totalMarks durationMinutes mockTestType allowedAttempts")
      .lean();

    if (!mockTest) {
      return res.status(404).json({
        message: "Mock test not found",
      });
    }

    /* ===============================
       FETCH ATTEMPTS
    =============================== */
    const attempts = await MockTestAttempt.find({
      userId,
      mockTestId,
      status: { $in: ["SUBMITTED", "EXPIRED"] },
    })
      .sort({ attemptNumber: -1 })
      .lean();

    if (!attempts.length) {
      return res.status(404).json({
        message: "No completed attempts found",
      });
    }

    const latestAttempt = attempts[0];

    const latestResult = await MockTestResult.findOne({
      attemptId: latestAttempt._id,
    }).lean();

    if (!latestResult.solutionsUnlocked) {
      return res.json({
        locked: true,

        mockTest: {
          id: mockTestId,
          title: mockTest.title,
          totalMarks: mockTest.totalMarks,
          durationMinutes: mockTest.durationMinutes,
          mockTestType: mockTest.mockTestType,
          allowedAttempts: mockTest.allowedAttempts,
        },

        attempt: {
          attemptNumber: latestAttempt.attemptNumber,
          submittedAt: latestAttempt.submittedAt,
        },

        result: {
          score: latestResult.score,
          correctCount: latestResult.correctCount,
          incorrectCount: latestResult.incorrectCount,
          unattemptedCount: latestResult.unattemptedCount,
          timeTakenSeconds: latestResult.timeTakenSeconds,
        },

        latestAttemptNumber: latestAttempt.attemptNumber,
      });
    }

    /* ===============================
       SELECT ATTEMPT
    =============================== */
    let attemptDoc;

    if (attemptQuery) {
      attemptDoc = attempts.find(
        (a) => a.attemptNumber === Number(attemptQuery),
      );

      if (!attemptDoc) {
        return res.status(404).json({
          message: "Attempt not found",
        });
      }
    } else {
      attemptDoc = attempts[0];
    }

    const attemptId = attemptDoc._id;

    /* ===============================
       FETCH SECTION META
    =============================== */
    const sectionsMeta = await MockTestSection.find({
      mockTestId,
    })
      .sort({ sectionOrder: 1 })
      .lean();

    const sectionMetaMap = new Map();
    sectionsMeta.forEach((s) => sectionMetaMap.set(s._id.toString(), s));

    /* ===============================
       FETCH QUESTIONS
    =============================== */
    const questions = await MockTestQuestion.find({
      mockTestId,
    })
      .sort({ questionOrder: 1 })
      .lean();

    /* ===============================
       FETCH ANSWERS
    =============================== */
    const answers = await MockTestAnswer.find({
      attemptId,
    }).lean();

    const answerMap = new Map();
    answers.forEach((a) => answerMap.set(a.questionId.toString(), a));

    /* ===============================
       BUILD SECTIONS
    =============================== */
    const sectionsMap = new Map();

    for (const q of questions) {
      const ans = answerMap.get(q._id.toString());
      const meta = sectionMetaMap.get(q.mockTestSectionId.toString());

      if (!meta) continue;

      let state = "UNATTEMPTED";
      let marksAwarded = 0;

      /* evaluate */
      if (ans && ans.isAnswered) {
        if (q.questionType === "NAT") {
          const val = ans.numericAnswer;
          if (val != null) {
            const tol = q.tolerance ?? 0;
            const correct = Math.abs(val - q.numericAnswer) <= tol;

            if (correct) {
              state = "CORRECT";
              marksAwarded = q.marks;
            } else {
              state = "INCORRECT";
              marksAwarded = -q.negativeMarks;
            }
          }
        } else {
          const user = ans.selectedOptions || [];
          const correct = q.correctAnswer || [];

          const match =
            user.length === correct.length &&
            user.every((o) => correct.includes(o));

          if (match) {
            state = "CORRECT";
            marksAwarded = q.marks;
          } else {
            state = "INCORRECT";
            marksAwarded = -q.negativeMarks;
          }
        }
      }

      const secId = q.mockTestSectionId.toString();

      if (!sectionsMap.has(secId)) {
        sectionsMap.set(secId, {
          sectionId: secId,
          sectionTitle: meta.title,
          questionType: meta.questionType,
          questionsToAttempt: meta.questionsToAttempt,
          sectionOrder: meta.sectionOrder,
          questions: [],
          score: 0,
          maxScore: 0,
        });
      }

      const sec = sectionsMap.get(secId);

      sec.questions.push({
        ...q,
        userAnswer: ans || null,
        resultState: state,
        marksAwarded,
      });

      sec.score += marksAwarded;
    }

    /* ===============================
       COMPUTE MAX SCORE
    =============================== */
    for (const sec of sectionsMap.values()) {
      sec.maxScore = computeSectionMaxScore(sec);
    }

    /* ===============================
       ORDER SECTIONS
    =============================== */
    const sections = Array.from(sectionsMap.values()).sort(
      (a, b) => a.sectionOrder - b.sectionOrder,
    );

    /* ===============================
       RESULT SUMMARY
    =============================== */
    const result = await MockTestResult.findOne({
      attemptId,
    }).lean();

    /* ===============================
       RESPONSE
    =============================== */
    return res.json({
      mockTest: {
        id: mockTestId,
        title: mockTest.title,
        totalMarks: mockTest.totalMarks,
        durationMinutes: mockTest.durationMinutes,
        mockTestType: mockTest.mockTestType,
        allowedAttempts: mockTest.allowedAttempts,
      },

      attempt: {
        attemptNumber: attemptDoc.attemptNumber,
        submittedAt: attemptDoc.submittedAt,
      },

      result,
      sections,

      attempts: attempts.map((a) => ({
        attemptNumber: a.attemptNumber,
        submittedAt: a.submittedAt,
      })),

      latestAttemptNumber: attempts[0].attemptNumber,
      selectedAttemptNumber: attemptDoc.attemptNumber,
    });
  } catch (e) {
    console.error("getAttemptResult error:", e);
    return res.status(500).json({
      message: "Failed to load result",
    });
  }
};

export const getMockTestLeaderboard = async (req, res) => {
  try {
    const { mockTestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({ message: "Invalid mockTestId" });
    }

    /* ===============================
       FETCH MOCK TEST META
    =============================== */

    const mockTest = await MockTest.findById(mockTestId)
      .select("title durationMinutes totalMarks mockTestType")
      .lean();

    if (!mockTest) {
      return res.status(404).json({
        message: "Mock test not found",
      });
    }

    /* ===============================
       BEST ATTEMPT PER USER
    =============================== */

    const bestAttempts = await MockTestResult.aggregate([
      { $match: { mockTestId: new mongoose.Types.ObjectId(mockTestId) } },

      {
        $sort: {
          score: -1,
          timeTakenSeconds: 1,
          createdAt: 1,
        },
      },

      {
        $group: {
          _id: "$userId",
          best: { $first: "$$ROOT" },
        },
      },

      { $replaceRoot: { newRoot: "$best" } },

      {
        $sort: {
          score: -1,
          timeTakenSeconds: 1,
          createdAt: 1,
        },
      },
    ]);

    /* ===============================
       ASSIGN RANK
    =============================== */

    let rank = 0;
    let prevScore = null;
    let prevTime = null;

    const ranked = bestAttempts.map((r, i) => {
      if (r.score !== prevScore || r.timeTakenSeconds !== prevTime) {
        rank = i + 1;
        prevScore = r.score;
        prevTime = r.timeTakenSeconds;
      }

      return { ...r, rank };
    });

    /* ===============================
       FETCH USER INFO
    =============================== */

    const userIds = ranked.map((r) => r.userId);

    const users = await User.find({
      _id: { $in: userIds },
    })
      .select("name profileImage")
      .lean();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    /* ===============================
       FETCH ALL ATTEMPTS
    =============================== */

    const allAttempts = await MockTestResult.find({
      mockTestId,
      userId: { $in: userIds },
    })
      .select("userId score attemptNumber timeTakenSeconds")
      .lean();

    const attemptsMap = new Map();

    allAttempts.forEach((a) => {
      const uid = a.userId.toString();
      if (!attemptsMap.has(uid)) attemptsMap.set(uid, []);
      attemptsMap.get(uid).push(a);
    });

    /* ===============================
       BUILD RESPONSE
    =============================== */

    const leaderboard = ranked.map((r) => {
      const uid = r.userId.toString();
      const attempts = attemptsMap.get(uid) || [];

      return {
        rank: r.rank,
        userId: r.userId,
        name: userMap.get(uid)?.name || "User",
        photo: userMap.get(uid)?.profileImage || null,

        bestAttempt: {
          score: r.score,
          attemptNumber: r.attemptNumber,
          timeTakenSeconds: r.timeTakenSeconds,
        },

        attempts: attempts
          .sort((a, b) => a.attemptNumber - b.attemptNumber)
          .map((a) => ({
            attemptNumber: a.attemptNumber,
            score: a.score,
            timeTakenSeconds: a.timeTakenSeconds,
          })),
      };
    });

    /* ===============================
       RESPONSE
    =============================== */

    return res.json({
      mockTest: {
        _id: mockTest._id,
        title: mockTest.title,
        durationMinutes: mockTest.durationMinutes,
        totalMarks: mockTest.totalMarks,
        mockTestType: mockTest.mockTestType,
      },
      totalParticipants: leaderboard.length,
      leaderboard,
    });
  } catch (e) {
    console.error("Leaderboard error:", e);
    return res.status(500).json({
      message: "Failed to load leaderboard",
    });
  }
};

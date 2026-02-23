import { MockTest } from "../models/mockTest.model.js";
import { MockTestAttempt } from "../models/mockTestAttempt.model.js";
import { MockTestAnswer } from "../models/mockTestAnswers.model.js";
import { MockTestQuestion } from "../models/mockTestQuestion.model.js";
import { MockTestSection } from "../models/mockTestSection.model.js";
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

// ===============================
// helper: evaluate attempt
// ===============================

const evaluateAttempt = async (attemptId) => {

  const attempt = await MockTestAttempt.findById(attemptId).lean();
  if (!attempt) throw new Error("Attempt not found");

  const answers = await MockTestAnswer.find({ attemptId }).lean();

  const questions = await MockTestQuestion.find({
    mockTestId: attempt.mockTestId
  }).lean();

  const sections = await MockTestSection.find({
    mockTestId: attempt.mockTestId
  }).lean();

  // ===============================
  // Build Question Map
  // ===============================
  const questionMap = {};
  questions.forEach(q => {
    questionMap[q._id.toString()] = q;
  });

  // ===============================
  // SECTION-WISE VALID ANSWER FILTERING
  // ===============================
  const validAnswerIds = new Set();

  for (const section of sections) {

    // All questions of this section
    const sectionQuestions = questions
      .filter(q =>
        q.mockTestSectionId.toString() === section._id.toString()
      )
      .sort((a, b) => a.questionOrder - b.questionOrder);

    // All ANSWERED answers of this section
    const sectionAnswers = answers
      .filter(a => {
        const q = questionMap[a.questionId.toString()];
        return (
          q &&
          q.mockTestSectionId.toString() === section._id.toString() &&
          a.isAnswered
        );
      })
      .sort((a, b) => {
        const qa = questionMap[a.questionId.toString()];
        const qb = questionMap[b.questionId.toString()];
        return qa.questionOrder - qb.questionOrder;
      });

    if (section.questionsToAttempt !== null) {
      const allowed = sectionAnswers.slice(0, section.questionsToAttempt);
      allowed.forEach(a => validAnswerIds.add(a._id.toString()));
    } else {
      sectionAnswers.forEach(a => validAnswerIds.add(a._id.toString()));
    }
  }

  // ===============================
  // SCORING
  // ===============================
  let totalScore = 0;
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  for (const answer of answers) {

    const question = questionMap[answer.questionId.toString()];
    if (!question) continue;

    // Not answered → skipped
    if (!answer.isAnswered) {
      skipped++;
      continue;
    }

    // If exceeded section limit → ignore silently
    if (!validAnswerIds.has(answer._id.toString())) {
      continue;
    }

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
    // MSQ (Exact Match)
    // =====================
    if (question.questionType === "MSQ") {
      const selected = [...answer.selectedOptions].sort();
      const correctAns = [...question.correctAnswer].sort();

      if (JSON.stringify(selected) === JSON.stringify(correctAns)) {
        isCorrect = true;
      }
    }

    // =====================
    // NAT (With Tolerance)
    // =====================
    if (question.questionType === "NAT") {
      if (question.numericAnswer !== null &&
          answer.numericAnswer !== null) {

        const diff = Math.abs(
          answer.numericAnswer - question.numericAnswer
        );

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

  return {
    totalScore,
    correct,
    wrong,
    skipped
  };
};

// ===============================
// START / RESUME
// ===============================
export const startMockTestAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mockTestId } = req.params;

    const mockTest = await MockTest.findById(mockTestId).select("-instructions").lean();
    if (!mockTest || mockTest.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Mock test not found" });
    }

    const durationSeconds = mockTest.durationMinutes * 60;

    // latest attempt
    const latest = await MockTestAttempt.findOne({
      userId,
      mockTestId
    }).sort({ attemptNumber: -1 });

    // =====================================
    // RESUME EXISTING
    // =====================================
    if (latest && latest.status === "IN_PROGRESS") {
      const remaining = computeRemainingSeconds(latest);

      // EXPIRED
if (remaining <= 0) {

  // Prevent double processing
  if (latest.status === "SUBMITTED" || latest.status === "EXPIRED") {
    return res.json({
      expired: true,
      attemptId: latest._id,
      mockTest
    });
  }

  // Lock attempt
  latest.status = "EXPIRED";

  // Set exact submission time
  latest.submittedAt = new Date(
    latest.startedAt.getTime() +
    latest.durationSeconds * 1000
  );

  await latest.save();

  // ===============================
  // Evaluate Attempt
  // ===============================
  const result = await evaluateAttempt(latest._id);

  // ===============================
  // Save Result in MockTestResult
  // ===============================

  const savedResult = await MockTestResult.create({
    attemptId: latest._id,
    userId: latest.userId,
    mockTestId: latest.mockTestId,
    bundleId: latest.bundleId || null,

    score: result.totalScore,
    correctCount: result.correct,
    incorrectCount: result.wrong,
    unattemptedCount: result.skipped
  });

  return res.json({
    expired: true,
    attemptId: latest._id,
    mockTest,
    result: savedResult
  });
}

      // STILL ACTIVE
      return res.json({
        attemptId: latest._id,
        mockTest,
        resume: true,
        startedAt: latest.startedAt,
        durationSeconds: latest.durationSeconds,
        remainingSeconds: remaining
      });
    }

    // =====================================
    // CHECK ALLOWED ATTEMPTS
    // =====================================
    const nextAttempt = (latest?.attemptNumber || 0) + 1;

    if (nextAttempt > mockTest.allowedAttempts) {
      return res.status(403).json({
        message: "No attempts remaining"
      });
    }

    // =====================================
    // CREATE NEW ATTEMPT
    // =====================================
    const newAttempt = await MockTestAttempt.create({
      userId,
      mockTestId,
      bundleId: mockTest.bundleId,
      attemptNumber: nextAttempt,
      durationSeconds
    });

    return res.json({
      attemptId: newAttempt._id,
      mockTest,
      resume: false,
      startedAt: newAttempt.startedAt,
      durationSeconds,
      remainingSeconds: durationSeconds
    });

  } catch (err) {
    console.error("Start attempt error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getMockTestAttemptSession = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await MockTestAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    const mockTest = await MockTest.findById(attempt.mockTestId).select("-instructions").lean();
    if (!mockTest) {
      return res.status(404).json({ message: "Mock test not found" });
    }

    // =====================
    // expiry check
    // =====================
    const remaining = computeRemainingSeconds(attempt);

    if (attempt.status === "IN_PROGRESS" && remaining <= 0) {
      attempt.status = "EXPIRED";
      attempt.submittedAt = new Date(
        attempt.startedAt.getTime() +
          attempt.durationSeconds * 1000
      );
      await attempt.save();

      const result = await evaluateAttempt(attempt._id);

      return res.json({
        expired: true,
        attemptId,
        mockTest,
        result
      });
    }

    // =====================
    // fetch questions
    // =====================
   const questionsRaw = await MockTestQuestion.find(
  { mockTestId: attempt.mockTestId },
  {
    correctAnswer: 0,
    numericAnswer: 0,
    tolerance: 0,
    answerExplanation: 0,
    __v: 0
  }
)
.populate("mockTestSectionId", "title questionType totalQuestions questionsToAttempt sectionOrder")
.lean();

// ===============================
// sort by sectionOrder -> questionOrder
// ===============================
questionsRaw.sort((a, b) => {
  const secA = a.mockTestSectionId.sectionOrder;
  const secB = b.mockTestSectionId.sectionOrder;

  if (secA !== secB) return secA - secB;
  return a.questionOrder - b.questionOrder;
});

// ===============================
// group into sections
// ===============================
const sectionMap = {};

questionsRaw.forEach(q => {
  const sec = q.mockTestSectionId;
  const secId = sec._id.toString();

  if (!sectionMap[secId]) {
    sectionMap[secId] = {
      sectionId: secId,
      sectionTitle: sec.title,
      questionType: sec.questionType,
      totalQuestions: sec.totalQuestions,
      questions: []
    };
  }

  delete q.mockTestSectionId;

  sectionMap[secId].questions.push(q);
});

const sections = Object.values(sectionMap);

    const answers = await MockTestAnswer.find({
      attemptId
    });

    return res.json({
      attemptId,
      mockTest,
      startedAt: attempt.startedAt,
      durationSeconds: attempt.durationSeconds,
      remainingSeconds: remaining,
      sections,
      answers
    });

  } catch (err) {
    console.error("Get session error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const saveAnswer = async (req, res) => {
  try {
    const { attemptId, questionId } = req.params;
    const {
      questionType,
      selectedOptions,
      numericAnswer,
      isMarkedForReview
    } = req.body;

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
      isVisited: true
    };

    let isAnswered = false;

    // MCQ / MSQ logic
    if (questionType === "MCQ" || questionType === "MSQ") {
      const options = Array.isArray(selectedOptions)
        ? selectedOptions
        : [];

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
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      message: isAnswered
        ? "Answer saved successfully"
        : "Answer cleared successfully",
      answer
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const submitMockTest = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await MockTestAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    if (attempt.status === "SUBMITTED") {
      return res.status(400).json({
        message: "Test already submitted"
      });
    }

    if (attempt.status === "EXPIRED") {
      return res.status(400).json({
        message: "Test already expired"
      });
    }

    // =============================
    // Evaluate Attempt
    // =============================
    const evaluation = await evaluateAttempt(attemptId);

    // =============================
    // Update Attempt Status
    // =============================
    attempt.status = "SUBMITTED";
    attempt.submittedAt = new Date();
    await attempt.save();

    // =============================
    // Save Result in Result Schema
    // =============================
    const resultDoc = await MockTestResult.create({
      attemptId: attempt._id,
      userId: attempt.userId,
      mockTestId: attempt.mockTestId,
      bundleId: attempt.bundleId || null,

      score: evaluation.totalScore,
      correctCount: evaluation.correct,
      incorrectCount: evaluation.wrong,
      unattemptedCount: evaluation.skipped,
    });

    return res.status(200).json({
      message: "Mock test submitted successfully",
      result: resultDoc
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};
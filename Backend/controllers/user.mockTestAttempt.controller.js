import { MockTest } from "../models/mockTest.model.js";
import { MockTestAttempt } from "../models/mockTestAttempt.model.js";
import { MockTestAnswer } from "../models/mockTestAnswers.model.js";
import { MockTestQuestion } from "../models/mockTestQuestion.model.js";

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
  const answers = await MockTestAnswer.find({ attemptId }).lean();
  const questions = await MockTestQuestion.find({
    mockTestId: answers[0]?.mockTestId
  }).lean();

  // TODO: your scoring logic here
  // For now placeholder
  const score = 0;

  return { score };
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
        latest.status = "EXPIRED";
        latest.submittedAt = new Date(
          latest.startedAt.getTime() +
            latest.durationSeconds * 1000
        );
        await latest.save();

        const result = await evaluateAttempt(latest._id);

        return res.json({
          expired: true,
          attemptId: latest._id,
          mockTest,
          result
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
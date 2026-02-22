import { MockTest } from "../models/mockTest.model.js";
import { MockTestAttempt } from "../models/mockTestAttempt.model.js";
import { MockTestBundleEnrollment } from "../models/mockTestBundleEnrollment.model.js";
import { MockTestAnswer } from "../models/mockTestAnswer.model.js";
import { MockQuestion } from "../models/mockQuestion.model.js";

export const startMockTestAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testId } = req.params;

    const mockTest = await MockTest.findById(testId);
    if (!mockTest || mockTest.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Mock test not found" });
    }

    const durationSeconds = mockTest.durationMinutes * 60;

    const attempts = await MockTestAttempt.find({
      userId,
      mockTestId: testId
    }).sort({ attemptNumber: -1 });

    const latest = attempts[0];

    // =====================================
    // RESUME EXISTING ATTEMPT
    // =====================================
    if (latest && latest.status === "IN_PROGRESS") {
      const now = new Date();

      // HARD WALL CLOCK END
      const examEndTime = new Date(
        latest.startedAt.getTime() + durationSeconds * 1000
      );

      // AUTO SUBMIT IF RETURNED AFTER END
      if (now > examEndTime) {
        latest.status = "SUBMITTED";
        latest.submittedAt = examEndTime;
        latest.remainingSeconds = 0;

        await latest.save();

        return res.status(403).json({
          message: "Exam already ended",
          autoSubmitted: true
        });
      }

      const remainingSeconds =
        durationSeconds - latest.totalActiveSeconds;

      return res.json({
        attemptId: latest._id,
        resume: true,
        remainingSeconds,
        totalActiveSeconds: latest.totalActiveSeconds
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
      mockTestId: testId,
      attemptNumber: nextAttempt,
      remainingSeconds: durationSeconds
    });

    return res.json({
      attemptId: newAttempt._id,
      resume: false,
      remainingSeconds: durationSeconds,
      totalActiveSeconds: 0
    });

  } catch (err) {
    console.error("Start attempt error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateActiveTime = async (req, res) => {
  try {
    const userId = req.user._id;
    const { attemptId } = req.params;

    const attempt = await MockTestAttempt.findById(attemptId);

    if (!attempt || attempt.status !== "IN_PROGRESS") {
      return res.status(404).json({ message: "Attempt not active" });
    }

    const mockTest = await MockTest.findById(attempt.mockTestId);
    const durationSeconds = mockTest.durationMinutes * 60;

    const now = new Date();

    // =========================
    // HARD WALL CLOCK CHECK
    // =========================
    const examEndTime = new Date(
      attempt.startedAt.getTime() + durationSeconds * 1000
    );

    if (now > examEndTime) {
      attempt.status = "SUBMITTED";
      attempt.submittedAt = examEndTime;
      attempt.remainingSeconds = 0;

      await attempt.save();

      return res.json({
        status: "SUBMITTED",
        remainingSeconds: 0
      });
    }

    // =========================
    // ACTIVE TIME UPDATE
    // =========================
    const deltaSeconds = Math.floor(
      (now - attempt.lastActiveAt) / 1000
    );

    // cap to ~5 min to avoid abuse
    const cappedDelta = Math.min(deltaSeconds, 5 * 60 + 30);

    attempt.totalActiveSeconds += cappedDelta;
    attempt.lastActiveAt = now;

    const remainingSeconds =
      durationSeconds - attempt.totalActiveSeconds;

    if (remainingSeconds <= 0) {
      attempt.status = "SUBMITTED";
      attempt.submittedAt = now;
      attempt.remainingSeconds = 0;
    } else {
      attempt.remainingSeconds = remainingSeconds;
    }

    await attempt.save();

    return res.json({
      status: attempt.status,
      remainingSeconds: attempt.remainingSeconds,
      totalActiveSeconds: attempt.totalActiveSeconds
    });

  } catch (err) {
    console.error("Active time update error:", err);
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

    // ✅ fetch questions
    const questions = await MockQuestion.find({
      mockTestId: attempt.mockTestId,
    }).sort({ order: 1 });

    // ✅ fetch answers
    const answers = await MockTestAnswer.find({
      attemptId,
    });

    return res.json({
      attempt,
      questions,
      answers,
    });
  } catch (err) {
    console.error("Get session error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
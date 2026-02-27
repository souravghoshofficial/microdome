import mongoose, { Schema } from "mongoose";

const mockTestResultSchema = new Schema(
  {
    attemptId: {
      type: Schema.Types.ObjectId,
      ref: "MockTestAttempt",
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    mockTestId: {
      type: Schema.Types.ObjectId,
      ref: "MockTest",
      required: true,
      index: true,
    },

    bundleId: {
      type: Schema.Types.ObjectId,
      ref: "MockTestBundle",
      default: null,
    },

    /* ===== leaderboard fields ===== */

    attemptNumber: {
      type: Number,
      required: true,
    },

    timeTakenSeconds: {
      type: Number, // duration user actually used
      required: true,
    },

    /* ===== score ===== */

    score: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    unattemptedCount: { type: Number, default: 0 },

    // use to check if full solutions are unlocked for this result
    solutionsUnlocked: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true },
);

export const MockTestResult = mongoose.model(
  "MockTestResult",
  mockTestResultSchema,
);

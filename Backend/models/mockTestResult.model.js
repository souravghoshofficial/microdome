import mongoose, { Schema } from "mongoose";

const mockTestResultSchema = new Schema(
  {
    attemptId: {
      type: Schema.Types.ObjectId,
      ref: "MockTestAttempt",
      required: true,
      unique: true
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    mockTestId: {
      type: Schema.Types.ObjectId,
      ref: "MockTest",
      required: true
    },

    bundleId: {
      type: Schema.Types.ObjectId,
      ref: "MockTestBundle",
      default: null
    },

    score: {
      type: Number,
      default: 0
    },

    correctCount: {
      type: Number,
      default: 0
    },

    incorrectCount: {
      type: Number,
      default: 0
    },

    unattemptedCount: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

export const MockTestResult = mongoose.model(
  "MockTestResult",
  mockTestResultSchema
);
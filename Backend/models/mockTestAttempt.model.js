import mongoose, { Schema } from "mongoose";

const mockTestAttemptSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    mockTestId: {
      type: Schema.Types.ObjectId,
      ref: "MockTest",
      required: true,
      index: true
    },

    bundleId: {
      type: Schema.Types.ObjectId,
      ref: "MockTestBundle",
      default: null
    },

    attemptNumber: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["IN_PROGRESS", "SUBMITTED", "EXPIRED"],
      default: "IN_PROGRESS"
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    submittedAt: Date,

    // =========================
    // TIMER FIELDS
    // =========================

    lastActiveAt: {
      type: Date,
      default: Date.now
    },

    totalActiveSeconds: {
      type: Number,
      default: 0
    },

    remainingSeconds: {
      type: Number,
      default: null
    }

  },
  { timestamps: true }
);

mockTestAttemptSchema.index(
  { userId: 1, mockTestId: 1, attemptNumber: 1 },
  { unique: true }
);

export const MockTestAttempt = mongoose.model(
  "MockTestAttempt",
  mockTestAttemptSchema
);
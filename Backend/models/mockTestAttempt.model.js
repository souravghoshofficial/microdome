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
      default: "IN_PROGRESS",
      index: true
    },

    startedAt: {
      type: Date,
      default: Date.now,
      required: true
    },

    durationSeconds: {
      type: Number,
      required: true
    },

    submittedAt: {
      type: Date,
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
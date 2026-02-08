import mongoose, { Schema } from "mongoose";

const mockTestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    mockTestType: {
      type: String,
      enum: ["IIT_JAM", "CUET_PG", "GAT_B", "GATE"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    durationMinutes: {
      type: Number,
      required: true
    },

    totalMarks: {
      type: Number,
      required: true
    },

    accessType: {
      type: String,
      enum: ["FREE", "PAID"],
      required: true
    },

    instructions: {
      type: [String],
      default: []
    },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
      required: true
    }
  },
  { timestamps: true }
);

export const MockTest = mongoose.model("MockTest", mockTestSchema);

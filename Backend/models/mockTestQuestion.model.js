import mongoose, { Schema } from "mongoose";

const optionSchema = new Schema(
  {
    label: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: null
    }
  },
  { _id: false }
);

const mockTestQuestionSchema = new Schema(
  {
    mockTestId: {
      type: mongoose.Schema.ObjectId,
      ref: "MockTest",
      required: true,
      index: true
    },

    mockTestSectionId: {
      type: mongoose.Schema.ObjectId,
      ref: "MockTestSection",
      required: true,
      index: true
    },

    questionType: {
      type: String,
      enum: ["MCQ", "MSQ", "NAT"],
      required: true
    },

    questionText: {
      type: String,
      required: true
    },

    questionImageUrl: {
      type: String,
      default: null
    },

    options: {
      type: [optionSchema],
      default: [],
      validate: {
        validator: function (v) {
          if (this.questionType === "NAT") return v.length === 0;
          return v.length >= 2;
        },
        message: "Options invalid for question type"
      }
    },

    correctAnswer: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          if (this.questionType === "NAT") return v.length === 0;
          return v.length >= 1;
        },
        message: "Correct answer required for MCQ/MSQ"
      }
    },

    numericAnswer: {
      type: Number,
      default: null
    },

    tolerance: {
      type: Number,
      default: null
    },

    marks: {
      type: Number,
      required: true
    },

    negativeMarks: {
      type: Number,
      default: 0
    },

    questionOrder: {
      type: Number,
      required: true
    },

    answerExplanation: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export const MockTestQuestion = mongoose.model(
  "MockTestQuestion",
  mockTestQuestionSchema
);

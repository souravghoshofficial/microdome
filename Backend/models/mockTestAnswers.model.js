const mockTestAnswerSchema = new Schema(
  {
    attemptId: {
      type: Schema.Types.ObjectId,
      ref: "MockTestAttempt",
      required: true,
      index: true
    },

    questionId: {
      type: Schema.Types.ObjectId,
      ref: "MockTestQuestion",
      required: true
    },

    questionType: {
      type: String,
      enum: ["MCQ", "MSQ", "NAT"],
      required: true
    },

    // MCQ / MSQ
    selectedOptions: {
      type: [String],
      default: []
    },

    // NAT
    numericAnswer: {
      type: Number,
      default: null
    },

    isMarkedForReview: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

mockTestAnswerSchema.index(
  { attemptId: 1, questionId: 1 },
  { unique: true }
);

export const MockTestAnswer = mongoose.model(
  "MockTestAnswer",
  mockTestAnswerSchema
);
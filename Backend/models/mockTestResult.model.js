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

    percentage: Number,
    rank: Number,

    answersSnapshot: [
      {
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

        // MCQ/MSQ
        selectedOptions: {
          type: [String],
          default: []
        },

        correctOptions: {
          type: [String],
          default: []
        },

        // NAT
        numericAnswer: {
          type: Number,
          default: null
        },

        correctNumericAnswer: {
          type: Number,
          default: null
        },

        tolerance: {
          type: Number,
          default: null
        },

        marksAwarded: {
          type: Number,
          default: 0
        },

        isCorrect: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  { timestamps: true }
);

export const MockTestResult = mongoose.model(
  "MockTestResult",
  mockTestResultSchema
);
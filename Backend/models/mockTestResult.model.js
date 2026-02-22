const mockTestResultSchema = new Schema({
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

  score: Number,
  correctCount: Number,
  incorrectCount: Number,
  unattemptedCount: Number,

  percentage: Number,
  rank: Number,

  answersSnapshot: [
    {
      questionId: Schema.Types.ObjectId,
      selectedOption: String,
      correctOption: String,
      isCorrect: Boolean
    }
  ]
}, { timestamps: true });

export const MockTestResult = mongoose.model(
  "MockTestResult",
  mockTestResultSchema
);
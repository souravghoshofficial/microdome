const mockTestAnswerSchema = new Schema({
  attemptId: {
    type: Schema.Types.ObjectId,
    ref: "MockTestAttempt",
    required: true,
    index: true
  },

  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },

  selectedOption: {
    type: String,
    default: null
  },

  isMarkedForReview: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

mockTestAnswerSchema.index(
  { attemptId: 1, questionId: 1 },
  { unique: true }
);

export const MockTestAnswer = mongoose.model(
  "MockTestAnswer",
  mockTestAnswerSchema
);
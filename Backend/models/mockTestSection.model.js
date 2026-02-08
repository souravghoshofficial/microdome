import mongoose , {Schema} from "mongoose"

const mockTestSectionSchema = new Schema({
  mockTestId: {
    type: mongoose.Schema.ObjectId,
    ref: "MockTest",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  questionType: {
    type: String,
    enum: ["MCQ","MSQ","NAT"],
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  questionsToAttempt: {
    type: Number,
    default: null
  },
  sectionOrder: {
    type: Number,
    required: true
  },
},
{timestamps: true}
)

export const MockTestSection = mongoose.model("MockTestSection", mockTestSectionSchema);

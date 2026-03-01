import mongoose, {Schema} from "mongoose";

const mockTestFeedBackSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  mockTestId: {
    type: mongoose.Types.ObjectId,
    ref: "MockTest",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    trim: true,
    default: ""
  }
},
{ timestamps: true }
);

mockTestFeedBackSchema.index({ userId: 1, mockTestId: 1 }, { unique: true });

export const MockTestFeedBack = mongoose.model("MockTestFeedBack",mockTestFeedBackSchema)
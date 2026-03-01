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
    max: 5
  },
  review: {
    type: String,
    trim: true
  }
},
{ timestamps: true }
);

export const MockTestFeedBack = mongoose.model("MockTestFeedBack",mockTestFeedBackSchema)
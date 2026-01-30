import mongoose from "mongoose";

const mockTestBundleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    thumbnail: {
      type: String,
      required: true
    },

    actualPrice: {
      type: Number,
      required: true,
      min: 0
    },

    discountedPrice: {
      type: Number,
      required: true,
      min: 0
    },

    mockTestIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MockTest",
        required: true
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true 
  }
);

export const MockTestBundle = mongoose.model(
  "MockTestBundle",
  mockTestBundleSchema
);

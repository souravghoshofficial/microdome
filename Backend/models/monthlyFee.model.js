import mongoose, { Schema } from "mongoose";

const monthlyFeeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true
    },

    year: {
      type: Number,
      required: true,
      index: true
    },

    // One entry per month
    months: {
      jan: { type: Boolean, default: false },
      feb: { type: Boolean, default: false },
      mar: { type: Boolean, default: false },
      apr: { type: Boolean, default: false },
      may: { type: Boolean, default: false },
      jun: { type: Boolean, default: false },
      jul: { type: Boolean, default: false },
      aug: { type: Boolean, default: false },
      sep: { type: Boolean, default: false },
      oct: { type: Boolean, default: false },
      nov: { type: Boolean, default: false },
      dec: { type: Boolean, default: false }
    },

    // Optional but VERY useful
    lastPaidMonth: {
      type: String,
      enum: [
        "jan","feb","mar","apr","may","jun",
        "jul","aug","sep","oct","nov","dec"
      ]
    },

    remarks: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// One document per user per course per year
monthlyFeeSchema.index(
  { userId: 1, courseId: 1, year: 1 },
  { unique: true }
);

export const MonthlyFee = mongoose.model(
  "MonthlyFee",
  monthlyFeeSchema
);

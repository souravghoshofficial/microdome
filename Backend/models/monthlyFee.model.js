import mongoose, { Schema } from "mongoose";

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const monthlyFeeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    year: {
      type: Number,
      required: true,
      index: true,
    },

    // Month from which fee tracking starts
    startedFromMonth: {
      type: String,
      enum: MONTHS,
      required: true,
    },

    // Monthly payment tracking
    months: {
      jan: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      feb: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      mar: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      apr: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      may: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      jun: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      jul: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      aug: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      sep: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      oct: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      nov: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
      dec: {
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
      },
    },
  },
  { timestamps: true }
);

/**
 * One document per user + course + year
 * Prevents duplicates and data corruption
 */
monthlyFeeSchema.index(
  { userId: 1, courseId: 1, year: 1 },
  { unique: true }
);

export const MonthlyFee = mongoose.model(
  "MonthlyFee",
  monthlyFeeSchema
);
import mongoose, { Schema } from "mongoose";

const mockTestBundleEnrollmentSchema = new Schema({
    bundleId:{
      type: mongoose.Schema.ObjectId,
      ref: "MockTestBundle",
      required: true
    },
    userId:{
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    }
},
{
  timestamps: true
})

mockTestBundleEnrollmentSchema.index(
  { bundleId: 1, userId: 1 },
  { unique: true }
);

export const MockTestBundleEnrollment = mongoose.model("MockTestBundleEnrollment", mockTestBundleEnrollmentSchema)
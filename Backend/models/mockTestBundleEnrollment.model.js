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

export const mockTestBundleEnrollment = mongoose.model("mockTestBundleEnrollment", mockTestBundleEnrollmentSchema)
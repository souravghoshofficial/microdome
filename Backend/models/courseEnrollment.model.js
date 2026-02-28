import mongoose, { Schema } from "mongoose";

const courseEnrollmentSchema = new Schema({
    courseId:{
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: true
    },
    userId:{
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
},
{
  timestamps: true
})

courseEnrollmentSchema.index(
  { courseId: 1, userId: 1 },
  { unique: true }
);


export const CourseEnrollment = mongoose.model("CourseEnrollment", courseEnrollmentSchema)
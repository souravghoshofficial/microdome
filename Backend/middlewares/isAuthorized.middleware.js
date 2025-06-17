import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";

export const isEnrolledInCourse = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const user = await User.findById(userId).select(
      "isPremiumMember enrolledCourses"
    );

    if (!user?.isPremiumMember) {
      return res
        .status(401)
        .json({ message: "Unauthorized to access the course" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isEnrolled = user?.enrolledCourses?.includes(courseId);

    // const isEnrolled = (user.enrolledCourses || []).some(
    //   (enrolledCourseId) => String(enrolledCourseId) === String(courseId)
    // );

    if (!isEnrolled) {
      return res
        .status(401)
        .json({ message: "Unauthorized to access the course" });
    }

    next();
  } catch (error) {
    console.error("Error in isEnrolledInCourse middleware:", error);
    next(error);
  }
};

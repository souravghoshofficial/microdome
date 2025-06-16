import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";

export const isEnrolledInCourse = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    if (!courseId) {
      return res.status(400).json({
        message: "Course id is required"
      });
    }

    const user = await User.findById(userId);

    if (!user?.isPremiumMember) {
      return res.status(401).json({
        message: "Unauthorized to access the course"
      });;
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });;
    }

    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(401).json({
        message: "Unauthorized to access the course"
      });
    }

    next();
  } catch (error) {
    console.error("Error in isEnrolledInCourse middleware:", error);
    next(error); // Let the global error handler manage this
  }
};
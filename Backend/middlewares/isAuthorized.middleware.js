import mongoose from "mongoose"
import User from "../models/user.model.js"
import Course from "../models/course.model.js"

export const isEnrolledInCourse = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const courseId = req.params.id;

    console.log("REQ.USER:", req.user);
    console.log("COURSE ID:", courseId);

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const user = await User.findById(userId).select("isPremiumMember enrolledCourses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("USER ENROLLED COURSES:", user.enrolledCourses);

    if (!user.isPremiumMember) {
      return res.status(401).json({ message: "Not a premium user" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isEnrolled = user.enrolledCourses.some(id => id.equals(courseId));

    if (!isEnrolled) {
      return res.status(401).json({ message: "Not enrolled in course" });
    }

    next();
  } catch (error) {
    console.error("MIDDLEWARE ERROR:", error);
    next(error);
  }
};

import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { CourseEnrollment } from "../models/courseEnrollment.model.js";
export const isEnrolledInCourse = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const user = await User.findById(userId).select("role isPremiumMember enrolledCourses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.role === "admin" || user.role === "instructor") {
      return next();
    }


    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }


    if (!user.isPremiumMember) {
      return res.status(401).json({ message: "Unauthorized to access the course" });
    }

    
    const isEnrolled = user.enrolledCourses.some(id => id.equals(courseId));
    if (!isEnrolled) {
      return res.status(401).json({ message: "Unauthorized to access the course" });
    }

    const enrollment = await CourseEnrollment.findOne({
      userId: user._id,
      courseId: course._id
    });

    if(!enrollment){
      return res.status(401).json({ message: "Unauthorized to access the course" });
    }

    if(!enrollment.isActive){
      return res.status(401).json({ message: "Access has been revoked by the admin, contact admin." });
    }

    next();
  } catch (error) {
    console.error("MIDDLEWARE ERROR:", error);
    next(error);
  }
};

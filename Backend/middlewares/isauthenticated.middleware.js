import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

export const isEnrolledInCourse = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const courseId = req.params.courseId || req.body.courseId;

    if(!userId){
      // return res.status(400).json({ message: 'User ID is required' })
      throw new ApiError(400, "User ID is required");
    }

    if (!courseId) {
      // return res.status(400).json({ message: 'Course ID is required' });
      throw new ApiError(400, "Course ID is required");
    }

    const enrollment = await User.findOne({ user: userId, course: courseId });

    if (!enrollment) {
      // return res.status(403).json({ message: 'User is not enrolled in this course' });
      throw new ApiError(403,"User is not enrolled in this course");
    }
    next();
  } catch (error) {
    console.log(error);
    // res.status(500).json({ message: 'Server error' });
    throw new ApiError(500,"Server error");
  }
};
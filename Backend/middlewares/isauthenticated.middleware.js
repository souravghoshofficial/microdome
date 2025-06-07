import { User } from "../models/user.model";

export const isEnrolledInCourse = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const courseId = req.params.courseId || req.body.courseId;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    const enrollment = await User.findOne({ user: userId, course: courseId });

    if (!enrollment) {
      return res.status(403).json({ message: 'User is not enrolled in this course' });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
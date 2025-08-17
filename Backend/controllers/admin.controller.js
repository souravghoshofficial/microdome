import { User } from "../models/user.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CourseEnrollment } from "../models/courseEnrollment.model.js";
import { Course } from "../models/course.model.js";
import {
  sendAccessRevokedEmail,
  sendAccessGrantedEmail,
} from "../utils/sendEmail.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "-password -__v -updatedAt -enrolledCourses -presentCourseOfStudy"
    );
    res.status(200).json({
      message: "All users are fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error for fetching users: ", error);
    throw new ApiError(500, "Failed to fetch the users");
  }
};

// ------ quiz controllers ------- //

// Create Quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, timeLimit, questions } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !questions ||
      questions.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    for (let q of questions) {
      if (!q.questionText || !q.options || q.correctOption === undefined) {
        return res.status(400).json({ message: "Invalid question format" });
      }
    }

    // Step 1: Create all questions
    const createdQuestions = await Question.insertMany(questions);

    // Step 2: Create quiz with references to created questions
    const quiz = await Quiz.create({
      title,
      description,
      timeLimit,
      category,
      questions: createdQuestions.map((q) => q._id),
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getUserDetailsByCourseId = async (req, res) => {
//   try {
//     const courseId = req.params.id;

//     // Find all enrollments for this course and populate user details
//     const enrollments = await CourseEnrollment.find({ courseId })
//       .populate(
//         "userId",
//         "name email mobileNumber profileImage instituteName createdAt"
//       )
//       .lean();

//     if (!enrollments || enrollments.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No users found for this course",
//       });
//     }
//     const course = await Course.findById(courseId).select("cardTitle");

//     // Map to extract only the necessary details
//     const users = enrollments.map((enrollment) => ({
//       userId: enrollment.userId._id,
//       name: enrollment.userId.name,
//       email: enrollment.userId.email,
//       mobileNumber: enrollment.userId.mobileNumber,
//       profileImage: enrollment.userId.profileImage,
//       instituteName: enrollment.userId.instituteName,
//       createdAt: enrollment.createdAt,
//       isActive: enrollment.isActive,
//     }));

//     res.status(200).json({
//       success: true,
//       courseId,
//       totalUsers: users.length,
//       users,
//       courseName: course.cardTitle
//     });
//   } catch (error) {
//     console.error("Error fetching users by courseId:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

export const getUserDetailsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find all enrollments for this course and populate user details
    const enrollments = await CourseEnrollment.find({ courseId })
      .sort({ createdAt: -1 }) // ✅ Sort by newest first
      .populate(
        "userId",
        "name email mobileNumber profileImage instituteName createdAt"
      )
      .lean();

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for this course",
      });
    }

    const course = await Course.findById(courseId).select("cardTitle");

    // Map to extract only the necessary details
    const users = enrollments.map((enrollment) => ({
      userId: enrollment.userId._id,
      name: enrollment.userId.name,
      email: enrollment.userId.email,
      mobileNumber: enrollment.userId.mobileNumber,
      profileImage: enrollment.userId.profileImage,
      instituteName: enrollment.userId.instituteName,
      createdAt: enrollment.createdAt,
      isActive: enrollment.isActive,
    }));

    res.status(200).json({
      success: true,
      courseId,
      totalUsers: users.length,
      users,
      courseName: course.cardTitle,
    });
  } catch (error) {
    console.error("Error fetching users by courseId:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const revokeAccess = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const updatedEnrollment = await CourseEnrollment.findOneAndUpdate(
      { userId, courseId },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!updatedEnrollment) {
      return res.status(404).json({
        success: false,
        message: "User is not enrolled in this course",
      });
    }

    // Fetch user and course for email
    const user = await User.findById(userId).select("name email");
    const course = await Course.findById(courseId).select("cardTitle");

    if (user && course) {
      await sendAccessRevokedEmail({
        to: user.email,
        studentName: user.name,
        courseTitle: course.cardTitle,
      });
    }

    res.status(200).json({
      success: true,
      message: "Access revoked successfully",
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    console.error("Error revoking access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const grantAccess = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const updatedEnrollment = await CourseEnrollment.findOneAndUpdate(
      { userId, courseId },
      { $set: { isActive: true } },
      { new: true }
    );

    if (!updatedEnrollment) {
      return res.status(404).json({
        success: false,
        message: "User is not enrolled in this course",
      });
    }

    // Fetch user and course for email
    const user = await User.findById(userId).select("name email");
    const course = await Course.findById(courseId).select(
      "cardTitle linkAddress"
    );

    if (user && course) {
      await sendAccessGrantedEmail({
        to: user.email,
        studentName: user.name,
        courseTitle: course.cardTitle,
        accessLink: `https://microdomeclasses.in/my-courses/${courseId}`, // direct link to course
      });
    }

    res.status(200).json({
      success: true,
      message: "Access granted successfully",
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    console.error("Error granting access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourseDetailsWithUserCounts = async (req, res) => {
  try {
    const coursesWithCounts = await Course.aggregate([
      {
        $lookup: {
          from: "courseenrollments", // MongoDB will pluralize the model name
          localField: "_id",
          foreignField: "courseId",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          studentCount: { $size: "$enrollments" }, // count ALL enrollments
        },
      },
      {
        $project: {
          _id: 1,
          cardTitle: 1,
          studentCount: 1,
          courseImage: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      courses: coursesWithCounts,
    });
  } catch (error) {
    console.error("Error fetching course details with user counts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

import { User } from "../models/user.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CourseEnrollment } from "../models/courseEnrollment.model.js";
import { Course } from "../models/course.model.js";
import { QuizResult } from "../models/quizResult.model.js";
import { GoogleGenAI } from "@google/genai";
import {
  sendAccessRevokedEmail,
  sendAccessGrantedEmail,
} from "../utils/sendEmail.js";

import { Coupon } from "../models/coupon.model.js";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getAllUsers = async (req, res) => {
  try {
    const { limit } = req.query; // read query parameter (optional)

    let query = User.find({})
      .select(
        "-password -__v -updatedAt -enrolledCourses -presentCourseOfStudy"
      )
      .sort({ createdAt: -1 }); // newest first

    if (limit) {
      query = query.limit(parseInt(limit)); // apply limit if provided
    }

    const users = await query;

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error fetching users: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch the users",
    });
  }
};

// ------ quiz controllers ------- //

//  Quiz
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

    // Validate question format
    for (let q of questions) {
      if (
        !q.questionText ||
        !q.options ||
        q.options.length < 2 ||
        q.correctOption === undefined
      ) {
        return res.status(400).json({ message: "Invalid question format" });
      }
    }

    // Step 1: Create all questions
    const createdQuestions = await Question.insertMany(questions);

    // Step 2: Create quiz with references
    const quiz = await Quiz.create({
      title,
      description,
      category,
      timeLimit,
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


export const generateQuiz = async (req, res) => {
  try {
    const { title, description, subject, topic, numQuestions, timeLimit } =
      req.body;

    const prompt = `
You are an expert quiz generator for students preparing for MSc entrance exams 
like IIT JAM, CUET PG, and other postgraduate-level exams in the fields of 
Biology, Microbiology, Biotechnology, Biochemistry, and Life Sciences. 

The questions should:
- Be of **college-level (B.Sc standard)** difficulty.
- Match the **style and rigor of competitive entrance exams**.
- Contain only **one correct answer** out of four options.
- Be factually accurate and clear.
- Avoid trivial/general knowledge questions.

Use the following quiz details:
Title: ${title}
Description: ${description}
Subject: ${subject}
Topic: ${topic}
Number of Questions: ${numQuestions}
Time Limit: ${timeLimit} minutes

Return the quiz in **strict JSON format** with this schema:

{
  "title": "string",
  "description": "string",
  "category": "free",
  "timeLimit": number,
  "questions": [
    {
      "questionText": "string",
      "options": ["string", "string", "string", "string"],
      "correctOption": number
    }
  ]
}

Important:
- Only return valid JSON.
- Do NOT include markdown fences.
- Do NOT add explanations or comments.
- Ensure "correctOption" is always an integer between 0–3.
- The number of questions MUST equal ${numQuestions}.
`;

    // Call Gemini
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const textResponse =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!textResponse) {
      return res.status(500).json({
        success: false,
        message: "No response from AI",
      });
    }

    // ✅ Parse into JSON object
    let quizObj;
    try {
      quizObj = JSON.parse(textResponse);
    } catch (err) {
      console.error("Failed to parse AI JSON:", textResponse);
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
      });
    }

    res.json({
      success: true,
      quiz: quizObj,
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({
      success: false,
      message:
        error?.response?.data?.error?.message ||
        "Quiz generation failed. Please try again later.",
    });
  }
};


export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().lean();

    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const studentCount = await QuizResult.countDocuments({
          quiz: quiz._id,
        });
        return {
          _id: quiz._id,
          title: quiz.title,
          category: quiz.category,
          noOfQuestions: quiz.questions.length,
          time: quiz.timeLimit,
          attemptedBy: studentCount,
        };
      })
    );

    res.json({
      success: true,
      data: quizzesWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getFullQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    res.json({ success: true, data: quiz });
  } catch (err) {
    console.error("Error fetching quiz:", err);
    res.status(500).json({ success: false, message: "Error fetching quiz" });
  }
};

export const editQuiz = async (req, res) => {
  try {
    const { title, description, category, timeLimit, questions } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // ✅ Update quiz details
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.category = category || quiz.category;
    quiz.timeLimit = timeLimit ?? quiz.timeLimit;

    // ✅ If questions provided, update or create them
    if (Array.isArray(questions)) {
      const updatedQuestionIds = [];

      for (let q of questions) {
        if (q._id) {
          // Update existing question
          const updatedQ = await Question.findByIdAndUpdate(
            q._id,
            {
              questionText: q.questionText,
              options: q.options,
              correctOption: q.correctOption,
            },
            { new: true }
          );
          if (updatedQ) updatedQuestionIds.push(updatedQ._id);
        } else {
          // Create new question
          const newQ = await Question.create({
            questionText: q.questionText,
            options: q.options,
            correctOption: q.correctOption,
          });
          updatedQuestionIds.push(newQ._id);
        }
      }

      quiz.questions = updatedQuestionIds;
    }

    const savedQuiz = await quiz.save();

    res.json({
      success: true,
      message: "Quiz updated successfully",
      data: await savedQuiz.populate("questions"),
    });
  } catch (err) {
    console.error("Error updating quiz:", err);
    res.status(500).json({ success: false, message: "Error updating quiz" });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    // 1. Find quiz
    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // 2. Delete related questions
    await Question.deleteMany({ _id: { $in: quiz.questions } });

    // 3. Delete related results
    await QuizResult.deleteMany({ quiz: quizId });

    // 4. Remove quizId from users’ attemptedQuizzes
    await User.updateMany(
      { attemptedQuizzes: quizId },
      { $pull: { attemptedQuizzes: quizId } }
    );

    // 5. Finally, delete the quiz itself
    await Quiz.findByIdAndDelete(quizId);

    return res.status(200).json({
      success: true,
      message: "Quiz and related data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Fetch quiz results with user details
    const results = await QuizResult.find({ quiz: quizId })
      .populate("user", "name email profileImage")
      .sort({ score: -1, attemptedAt: 1 }); // Highest score first, earlier attempt wins tie

    return res.status(200).json({
      success: true,
      data: {
        quizTitle: quiz.title,
        students: results.map((r) => ({
          id: r._id,
          name: r.user?.name || "Unknown",
          email: r.user?.email || "---",
          profileImage: r.user?.profileImage || null,
          score: r.score,
          attemptedAt: new Date(r.attemptedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ----------------------------------- //

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

export const createCouponCode = async (req, res) => {
  try {
    const { couponCode, courseId, discount } = req.body;
    if (!couponCode || !courseId || !discount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const coupon = await Coupon.create({ couponCode, courseId, discount });
    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Error while creating coupon",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

export const getAllCoupons = async (_, res) => {
  try {
    const coupons = await Coupon.find({}).populate("courseId", "cardTitle"); // fetch only cardTitle from Course

    if (!coupons || coupons.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No coupons found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "All coupons fetched successfully.",
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error.",
      error: error.message,
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;

    // check if couponId is provided
    if (!couponId) {
      return res.status(400).json({
        success: false,
        message: "Coupon ID is required",
      });
    }

    // find and delete coupon
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);

    if (!deletedCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      deletedCoupon,
    });
  } catch (error) {
    // console.error("Error deleting coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// --- analytics --- //

export const getTotalUserCount = async (_, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ success: true, totalUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPremiumUserCount = async (req, res) => {
  try {
    const premiumUsers = await User.countDocuments({ isPremiumMember: true });
    res.status(200).json({ success: true, premiumUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTotalCourses = async (req, res) => {
  try {
    const count = await Course.countDocuments();
    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching total courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total courses",
    });
  }
};

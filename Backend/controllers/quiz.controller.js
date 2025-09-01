import { Quiz } from "../models/quiz.model.js";
import { User } from "../models/user.model.js";
import { QuizResult } from "../models/quizResult.model.js";
import mongoose from "mongoose";


export const getAllQuizzes = async (_, res) => {
    try {
        const quizzes = await Quiz.find({})
            .select("_id title description timeLimit category questions");

        res.status(200).json({
            success: true,
            data: quizzes
        });

    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching quizzes"
        });
    }
};

export const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;

        const quiz = await Quiz.findById(quizId)
            .populate({
                path: "questions", // Field in Quiz schema
                model: "Question", // Model name
                select: "-__v -correctOption" 
            })
            .select("-__v");

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });

    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching quiz"
        });
    }
};


export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user._id; // ✅ assuming auth middleware attaches user

    // --- Input validation ---
    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ success: false, message: "Invalid quizId" });
    }

    if (!answers || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ success: false, message: "Answers must be a non-empty array" });
    }

    // --- Fetch quiz with populated questions ---
    const quiz = await Quiz.findById(quizId).populate({
      path: "questions",
      model: "Question",
      select: "-__v",
    });

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // --- Check if user already attempted this quiz ---
    const alreadyAttempted = await QuizResult.findOne({
      user: userId,
      quiz: quizId,
    });

    if (alreadyAttempted) {
      return res.status(400).json({
        success: false,
        message: "You have already attempted this quiz",
      });
    }

    const total = quiz.questions.length;
    let score = 0;

    // --- Evaluate answers ---
    const resultDetails = quiz.questions.map((q) => {
      const userAnswer = answers.find(
        (ans) => ans.questionId.toString() === q._id.toString()
      );

      const isCorrect =
        userAnswer &&
        Number(userAnswer.selectedOption) === q.correctOption;

      if (isCorrect) score++;

      return {
        questionId: q._id,
        question: q.questionText,
        options: q.options,
        selectedOption: userAnswer ? Number(userAnswer.selectedOption) : null,
        correctAnswer: q.correctOption,
        isCorrect,
      };
    });

    // --- Save result to DB ---
    const quizResult = new QuizResult({
      user: userId,
      quiz: quizId,
      score,
      total,
    });
    await quizResult.save();

    // --- Update user's attemptedQuizzes ---
    await User.findByIdAndUpdate(userId, {
      $addToSet: { attemptedQuizzes: quizId }, // ensures no duplicates
    });

    // --- Response ---
    return res.status(200).json({
      success: true,
      quizId,
      score,
      total,
      percentage: ((score / total) * 100).toFixed(2),
      resultDetails,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};




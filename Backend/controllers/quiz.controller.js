import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";


export const getAllQuizzes = async (_, res) => {
    try {
        const quizzes = await Quiz.find({})
            .select("_id title description timeLimit createdAt updatedAt");

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

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const quiz = await Quiz.findById(quizId).populate({
                path: "questions", 
                model: "Question", 
                select: "-__v" 
            });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    let total = quiz.questions.length;
    let resultDetails = [];

    quiz.questions.forEach((q) => {
      const userAnswer = answers.find(
        (ans) => ans.questionId.toString() === q._id.toString()
      );

      const isCorrect =
        userAnswer &&
        parseInt(userAnswer.selectedOption) === q.correctOption;

      if (isCorrect) score++;

      resultDetails.push({
        questionId: q._id,
        question: q.questionText,
        options: q.options, // All options
        selectedOption: userAnswer ? userAnswer.selectedOption : null,
        correctAnswer: q.correctOption, // Index of correct option
        isCorrect,
      });
    });

    return res.json({
      quizId,
      score,
      total,
      resultDetails,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

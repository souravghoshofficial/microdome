import Quiz from "../models/quiz.model.js"; 

export const checkQuizAccess = async (req, res, next) => {
  try {
    const user = req.user; 
    const quizId = req.params.id;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again.",
      });
    }

    // Fetch quiz from DB to check category
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    // If quiz is FREE → allow everyone
    if (quiz.category === "free") {
      return next();
    }

    // If quiz is PAID → check access
    if (quiz.category === "paid") {
      // Allow admins & instructors
      if (user.role === "admin" || user.role === "instructor") {
        return next();
      }

      // Allow students with paid access
      if (user.accessToQuizzes === true) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "You do not have access to this paid quiz.",
      });
    }

    // Fallback (should not reach here ideally)
    return res.status(400).json({
      success: false,
      message: "Invalid quiz category.",
    });
  } catch (error) {
    console.error("Quiz access check error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

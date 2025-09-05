import { Router } from "express";
import { getAllQuizzes , getQuizById , submitQuiz, getQuizLeaderboard } from "../controllers/quiz.controller.js";
import { verifyJWT } from  "../middlewares/auth.middleware.js"
import { checkQuizAccess } from "../middlewares/quizAccess.middleware.js";

const router = Router()


router.route("/").get(getAllQuizzes)
router.route("/:id").get(verifyJWT, checkQuizAccess, getQuizById)
router.route("/submit").post(verifyJWT, submitQuiz)
router.route("/:id/leaderboard").get(verifyJWT, getQuizLeaderboard)

export default router;
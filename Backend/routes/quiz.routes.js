import { Router } from "express";
import { getAllQuizzes , getQuizById , submitQuiz, getQuizLeaderboard, getQuizPrice } from "../controllers/quiz.controller.js";
import { verifyJWT } from  "../middlewares/auth.middleware.js"
import { checkQuizAccess } from "../middlewares/quizAccess.middleware.js";

const router = Router()


router.route("/").get(getAllQuizzes)
router.route("/:id").get(verifyJWT, checkQuizAccess, getQuizById)
router.route("/submit").post(verifyJWT, submitQuiz)
router.route("/:id/leaderboard").get(verifyJWT, getQuizLeaderboard)
router.route("/bundle/price").get(getQuizPrice)

export default router;
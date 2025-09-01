import { Router } from "express";
import { getAllQuizzes , getQuizById , submitQuiz } from "../controllers/quiz.controller.js";
import { verifyJWT } from  "../middlewares/auth.middleware.js"

const router = Router()


router.route("/").get(getAllQuizzes)
router.route("/:id").get(getQuizById)
router.route("/submit").post(verifyJWT, submitQuiz)

export default router;
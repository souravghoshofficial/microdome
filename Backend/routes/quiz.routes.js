import { Router } from "express";
import { getAllQuizzes , getQuizById , submitQuiz } from "../controllers/quiz.controller.js";

const router = Router()


router.route("/").get(getAllQuizzes)
router.route("/:id").get(getQuizById)
router.route("/submit").post(submitQuiz)

export default router;
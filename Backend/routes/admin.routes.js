import { Router } from "express";
import { getAllUsers , createQuiz } from "../controllers/admin.controller.js";


const router = Router();

router.route("/get-all-users").get(getAllUsers);


// ---- quiz routes ---- //
router.route("/create-quiz").post(createQuiz);


export default router;
import { Router } from "express";
import { submitFeedBack, checkFeedbackPrompt, markFeedbackPrompted } from "../controllers/mockTestFeedBack.controller.js";

const router = Router();

router.route("/:mockTestId/feedback").post(submitFeedBack);
router.route("/:mockTestId/feedback/check").get(checkFeedbackPrompt);
router.route("/:mockTestId/feedback/prompted").post(markFeedbackPrompted);

export default router;

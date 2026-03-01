import { Router } from "express";
import { submitFeedBack } from "../controllers/mockTestFeedBack.controller.js";

const router = Router();

router.route("/:mockTestId/feedback").post(submitFeedBack);


export default router;

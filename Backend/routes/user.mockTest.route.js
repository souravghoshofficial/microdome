import { Router } from "express";
import { getFreeMockTests ,getMockTestInstructions } from "../controllers/user.mockTest.controller.js";
import { verifyJWT, optionalAuth } from "../middlewares/auth.middleware.js"
import { checkMockTestEnrollment, checkAttemptOwnership, requireAttemptedMockTest } from "../middlewares/mockTest.middleware.js";
import { startMockTestAttempt, getMockTestAttemptSession, markVisited, saveAnswer, submitMockTest, getAttemptResult, getMockTestLeaderboard } from "../controllers/user.mockTestAttempt.controller.js";

const router = Router();

router.route("/").get(optionalAuth, getFreeMockTests);
router.route("/:mockTestId").get(verifyJWT, checkMockTestEnrollment, getMockTestInstructions);
router.route("/:mockTestId/start").post(verifyJWT, checkMockTestEnrollment, startMockTestAttempt);
router.route("/attempt/:attemptId").get(verifyJWT, checkAttemptOwnership, getMockTestAttemptSession);
router.route("/attempt/:attemptId/question/:questionId/visit").put(verifyJWT, checkAttemptOwnership, markVisited);
router.route("/attempt/:attemptId/question/:questionId/answer").put(verifyJWT, checkAttemptOwnership, saveAnswer);
router.route("/attempt/:attemptId/submit").post(verifyJWT, checkAttemptOwnership, submitMockTest)
router.route("/:mockTestId/result").get(verifyJWT, getAttemptResult);
router.route("/:mockTestId/leaderboard").get(verifyJWT, requireAttemptedMockTest, getMockTestLeaderboard);


export default router;
import { Router } from "express";
import { getAllUsers , createQuiz, getUserDetailsByCourseId, revokeAccess, grantAccess, getCourseDetailsWithUserCounts } from "../controllers/admin.controller.js";


const router = Router();

router.route("/get-all-users").get(getAllUsers);


// ---- quiz routes ---- //
router.route("/create-quiz").post(createQuiz);
router.route("/get-user-details/:id").get(getUserDetailsByCourseId);
router.route("/revoke-access").post(revokeAccess);
router.route("/grant-access").post(grantAccess);
router.route("/courses-with-user-counts").get(getCourseDetailsWithUserCounts);
export default router;
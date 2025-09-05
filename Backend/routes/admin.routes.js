import { Router } from "express";
import {
  getAllUsers,
  createQuiz,
  getUserDetailsByCourseId,
  revokeAccess,
  grantAccess,
  getCourseDetailsWithUserCounts,
  createCouponCode,
  getAllCoupons,
  deleteCoupon,
  getTotalUserCount,
  getPremiumUserCount,
  getTotalCourses,
  getAllQuizzes,
  getQuizResults,
  getFullQuizById,
  editQuiz,
  generateQuiz
} from "../controllers/admin.controller.js";
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware.js";

const router = Router();

router
  .route("/get-all-users")
  .get(authorizedRoles("admin", "instructor"), getAllUsers);
router
  .route("/get-user-details/:id")
  .get(authorizedRoles("admin", "instructor"), getUserDetailsByCourseId);

// ---- quiz routes ---- //
router.route("/create-quiz").post(authorizedRoles("admin", "instructor"), createQuiz);
router.route("/generate-quiz").post(authorizedRoles("admin", "instructor"), generateQuiz);
router.route("/quizzes").get(authorizedRoles("admin", "instructor"), getAllQuizzes);
router.route("/quiz/:id").get(authorizedRoles("admin", "instructor"), getFullQuizById);
router.route("/quiz/:id").put(authorizedRoles("admin", "instructor"), editQuiz);
router.route("/quiz/:quizId/results").get(authorizedRoles("admin", "instructor"), getQuizResults);


router
  .route("/courses-with-user-counts")
  .get(authorizedRoles("admin", "instructor"), getCourseDetailsWithUserCounts);
router.route("/create-coupon").post(authorizedRoles("admin"), createCouponCode);
router.route("/coupons").get(authorizedRoles("admin"), getAllCoupons);
router.route("/delete-coupon").post(authorizedRoles("admin"), deleteCoupon);

// ---- access revoke/grant ----- //
router.route("/revoke-access").post(authorizedRoles("admin"), revokeAccess);
router.route("/grant-access").post(authorizedRoles("admin"), grantAccess);


// --- stats --- //
router.route("/stats/users").get(authorizedRoles("admin", "instructor"), getTotalUserCount)
router.route("/stats/premium-users").get(authorizedRoles("admin", "instructor"), getPremiumUserCount)
router.route("/stats/courses").get(authorizedRoles("admin", "instructor"), getTotalCourses)

export default router;

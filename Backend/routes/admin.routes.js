import { Router } from "express";
import { getAllUsers , createQuiz, getUserDetailsByCourseId, revokeAccess, grantAccess, getCourseDetailsWithUserCounts,createCouponCode,getAllCoupons,deleteCoupon } from "../controllers/admin.controller.js";
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware.js";

const router = Router();

router.route("/get-all-users").get(getAllUsers);


// ---- quiz routes ---- //
router.route("/create-quiz").post(authorizedRoles("admin"), createQuiz);
router.route("/get-user-details/:id").get(authorizedRoles("admin"), getUserDetailsByCourseId);
router.route("/revoke-access").post(authorizedRoles("admin"), revokeAccess);
router.route("/grant-access").post(authorizedRoles("admin"), grantAccess);
router.route("/courses-with-user-counts").get(authorizedRoles("admin", "instructor"), getCourseDetailsWithUserCounts);
router.route("/create-coupon").post(authorizedRoles("admin"), createCouponCode);
router.route("/coupons").get(authorizedRoles("admin"), getAllCoupons);
router.route("/delete-coupon").post(authorizedRoles("admin"), deleteCoupon);
export default router;
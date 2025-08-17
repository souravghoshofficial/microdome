import { Router } from "express";
import { getAllUsers , createQuiz, getUserDetailsByCourseId, revokeAccess, grantAccess, getCourseDetailsWithUserCounts,createCouponCode,getAllCoupons,deleteCoupon } from "../controllers/admin.controller.js";


const router = Router();

router.route("/get-all-users").get(getAllUsers);


// ---- quiz routes ---- //
router.route("/create-quiz").post(createQuiz);
router.route("/get-user-details/:id").get(getUserDetailsByCourseId);
router.route("/revoke-access").post(revokeAccess);
router.route("/grant-access").post(grantAccess);
router.route("/courses-with-user-counts").get(getCourseDetailsWithUserCounts);
router.route("/create-coupon").post(createCouponCode);
router.route("/coupons").get(getAllCoupons);
router.route("/delete-coupon").post(deleteCoupon);
export default router;
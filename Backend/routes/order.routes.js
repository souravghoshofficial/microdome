import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = Router();
import { createOrder , verifyPayment ,validateCouponCode} from "../controllers/order.controller.js";
router.route("/create-order").post(verifyJWT , createOrder);
router.route("/verify-payment").post(verifyPayment);
router.route("/validate-coupon-code").post(validateCouponCode);
export default router;
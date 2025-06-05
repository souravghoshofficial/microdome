import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
const router = Router();
import { createOrder , verifyPayment } from "../controllers/order.controller.js";
router.route("/create-order").post(authorizeRoles("admin","user"),verifyJWT , createOrder);
router.route("/verify-payment").post(authorizeRoles("admin","user"),verifyPayment);

export default router;
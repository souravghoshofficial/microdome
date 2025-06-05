import { Router } from "express";

import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  forgotPassword,
  verifyForgotPasswordOTP,
  resendForgotPasswordOTP,
  resetPassword,
  logoutUser,
  getCurrentUser,
  updateUserAvatar,
  updateAccountsDetails
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
const router = Router();

router.route("/register").post(authorizeRoles("admin","user"),registerUser);
router.route("/verify-otp").post(authorizeRoles("admin","user"),verifyOTP);
router.route("/resend-otp").post(authorizeRoles("admin","user"),resendOTP);
router.route("/login").post(authorizeRoles("admin","user"),loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-forgot-password-otp").post(authorizeRoles("admin","user"),verifyForgotPasswordOTP);
router.route("/resend-forgot-password-otp").post(authorizeRoles("admin","user"),resendForgotPasswordOTP);
router.route("/reset-password").post(authorizeRoles("admin","user"),resetPassword);
router.route("/logout").post(authorizeRoles("admin","user"),verifyJWT, logoutUser);
router.route("/current-user").get(authorizeRoles("admin","user"),verifyJWT, getCurrentUser);

router
  .route("/update-user-profile-image")
  .post(
    verifyJWT,
    upload.fields([{ name: "profileImage", maxCount: 1 }]),
    updateUserAvatar
  );

router.route("/update-user-details").post(verifyJWT, updateAccountsDetails);
export default router;


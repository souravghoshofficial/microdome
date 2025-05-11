import { Router } from "express";
import { registerUser, loginUser, logoutUser , isLoggedIn } from "../controllers/user.controller.js" ;
const router= Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/isloggedin").get(isLoggedIn);

export default router;
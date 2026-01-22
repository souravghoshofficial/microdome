import { Router } from "express";

import { sendMessage } from "../utils/sendEmail.js";


const router = Router();

router.route("/send-mail").post(sendMessage);


export default router;

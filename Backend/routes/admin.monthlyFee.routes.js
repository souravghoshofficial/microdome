import { Router } from "express";

import { markMonthlyFeePaid, markMonthlyFeeUnpaid, getCourseMonthlyFeesByYear } from "../controllers/admin.monthlyFee.controller.js";
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware.js";

const router = Router();

router.get("/course/:courseId", authorizedRoles("admin"), getCourseMonthlyFeesByYear);

router.patch("/mark-paid", authorizedRoles("admin"), markMonthlyFeePaid);
router.patch("/mark-unpaid", authorizedRoles("admin"), markMonthlyFeeUnpaid);

export default router;
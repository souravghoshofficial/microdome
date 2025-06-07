import { Router } from "express";

import {checkUsers,isPremium,removeUser,upgradeToPremium} from "../controllers/admin.controller.js"

import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.route("/check-users").get(authorizeRoles("admin"),checkUsers);
router.route("/is-premium").post(authorizeRoles("admin"),isPremium);
router.route("/remove-user").post(authorizeRoles("admin"),removeUser);
router.route("/upgrade-to-premium").post(authorizeRoles("admin"),upgradeToPremium);

export default router;

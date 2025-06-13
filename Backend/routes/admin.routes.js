import { Router } from "express";

import {getAllUsers} from "../controllers/admin.controller.js";

// import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.route("/get-all-users").get(getAllUsers);
// router.route("/is-premium").post(isPremium);
// router.route("/remove-user").post(authorizeRoles("admin"),removeUser);
// router.route("/upgrade-to-premium").post(authorizeRoles("admin"),upgradeToPremium);

export default router;
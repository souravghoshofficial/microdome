import { Router } from "express";
import {getAllUsers} from "../controllers/admin.controller.js";


const router = Router();

router.route("/get-all-users").get(getAllUsers);


export default router;
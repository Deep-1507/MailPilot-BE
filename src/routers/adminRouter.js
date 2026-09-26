import { Router } from "express";
import { createAdmin,getAdminDetails,loginAdmin } from "../controllers/admin.js";
import { adminauthMiddleware } from "../middlewares/adminauthmiddleware.js";

const router = Router();

router.post("/signup", createAdmin);
router.post("/signin", loginAdmin);

router.get("/",adminauthMiddleware, getAdminDetails);

export default router;

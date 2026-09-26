import { Router } from "express";
import { createBusinessUser,getBusinessUsers,updateBusinessUser, deleteBusinessUser, getBusinessUsersforAdmin } from "../controllers/businessuser.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { adminauthMiddleware } from "../middlewares/adminauthmiddleware.js";

const router = Router();



router.post("/", authMiddleware, createBusinessUser);
router.get("/", authMiddleware, getBusinessUsers);
router.put("/:id", authMiddleware, updateBusinessUser);
router.delete("/:id", authMiddleware, deleteBusinessUser);


router.get("/admin/:id", adminauthMiddleware, getBusinessUsersforAdmin);


export default router;

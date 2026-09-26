import { Router } from "express";
import {
  createCred,
  getCreds,
  getCredById,
  updateCred,
  deleteCred,
  getCredsByAdmin,
  getAllCredsByAdmin
} from "../controllers/cred.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { adminauthMiddleware } from "../middlewares/adminauthmiddleware.js";

const router = Router();

router.post("/create", authMiddleware, createCred);
router.get("/", authMiddleware, getCreds);
router.get("/:id", authMiddleware, getCredById);
router.put("/:id", authMiddleware, updateCred);
router.delete("/:id", authMiddleware, deleteCred);




router.get("/admin/:id", adminauthMiddleware, getCredsByAdmin);
router.get("/admin", adminauthMiddleware, getAllCredsByAdmin);

export default router;

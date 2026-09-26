import { Router } from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  getTemplatesforAdmin,
  updateTemplate,
  deleteTemplate,
  getTemplatesByAdminForUser
} from "../controllers/template.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { adminauthMiddleware } from "../middlewares/adminauthmiddleware.js";

const router = Router();

router.post("/create", authMiddleware, createTemplate);
router.get("/", authMiddleware, getTemplates);
router.get("/:id", authMiddleware, getTemplateById);
router.put("/:id", authMiddleware, updateTemplate);
router.delete("/:id", authMiddleware, deleteTemplate);


router.get("/admin/:id", adminauthMiddleware, getTemplatesByAdminForUser);
router.get("/admin", adminauthMiddleware, getTemplatesforAdmin);

export default router;

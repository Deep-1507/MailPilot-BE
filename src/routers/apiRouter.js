import { Router } from "express";
import { deleteAPIKey, getAllAPI, getApi } from "../controllers/api.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { adminauthMiddleware } from "../middlewares/adminauthmiddleware.js";

const router = Router();

router.post("/getapikey", authMiddleware, getApi);

router.get("/admin/getallapikeys", adminauthMiddleware, getAllAPI);
router.delete("/admin/delteapikey/:id", adminauthMiddleware, deleteAPIKey);

export default router;
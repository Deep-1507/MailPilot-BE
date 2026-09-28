import express from "express";

import {
    connectMail,
    disconnectMail
} from "../controllers/mailController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/connect",authMiddleware, connectMail);

router.post("/disconnect",authMiddleware, disconnectMail);

export default router;
import express from "express";

import {
    connectMail,
    disconnectMail
} from "../controllers/mailController.js";

const router = express.Router();

router.post("/connect", connectMail);

router.post("/disconnect", disconnectMail);

export default router;
import { Router } from "express";
import { sendMail, trackEmail } from "../main/mailer.js";
import { getAllSentMailsHsitoryByAdmin, getSentMailsHsitory, getSentMailsHsitoryByAdmin } from "../controllers/mails.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { adminauthMiddleware } from "../middlewares/adminauthmiddleware.js";

const router = Router();

router.post("/sendmail", authMiddleware, sendMail);
router.get("/sentmailshistory", authMiddleware, getSentMailsHsitory);
router.get("/track-email/:trackingId", trackEmail);


router.get("/admin/sentmailshistory/:id", adminauthMiddleware, getSentMailsHsitoryByAdmin);
router.get("/admin/allsentmailshistory", adminauthMiddleware, getAllSentMailsHsitoryByAdmin);

export default router;

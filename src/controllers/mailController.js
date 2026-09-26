import { connectMailbox, disconnectMailbox } from "../services/imapService.js";

/**
 * Connect Gmail
 * POST /api/mail/connect
 */
export const connectMail = async (req, res) => {
  try {
    const { userId, credId, page = 1, limit = 50 } = req.body;

    if (!userId || !credId) {
      return res.status(400).json({
        success: false,
        message: "userId and credId are required",
      });
    }

    const io = req.app.get("io");

    console.log("Before connectMailbox");

    const emails = await connectMailbox(userId, credId, page, limit, (mail) => {
      io.to(userId).emit("new-mail", mail);
    });

    console.log("After connectMailbox");
    console.log("Total Emails:", emails.length);

    return res.status(200).json({
      success: true,
      total: emails.length,
      emails,
    });
  } catch (err) {
    console.error("connectMail Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

/**
 * Disconnect Gmail
 */
export const disconnectMail = async (req, res) => {
  try {
    const { userId } = req.body;

    await disconnectMailbox(userId);

    return res.json({
      success: true,
      message: "Mailbox disconnected",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

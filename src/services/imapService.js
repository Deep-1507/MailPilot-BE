import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import Cred from "../models/credModel.js";

const clients = new Map();

async function getCredentials(credId) {
  try {
    console.log(credId);
    const currentCredDetails = await Cred.findById(credId);

    if (!currentCredDetails) {
      throw new Error("No credentials found");
    }

    return {
      email: currentCredDetails.senderEmail,
      password: currentCredDetails.password,
    };
  } catch (error) {
    console.error("Failed to fetch credentials:", error.message);
    throw new Error("Unable to retrieve email credentials.");
  }
}

export async function connectMailbox(
  userId,
  credId,
  page = 1,
  limit = 50,
  onNewMail,
) {
  // Disconnect previous connection if exists
  if (clients.has(userId)) {
    try {
      await clients.get(userId).logout();
    } catch (e) {}
    clients.delete(userId);
  }

  const { email, password } = await getCredentials(credId);

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
    logger: false,
  });

  await client.connect();

  console.log(`✅ Connected : ${email}`);

  const mailbox = await client.mailboxOpen("INBOX");

  clients.set(userId, client);

  // -------------------------
  // Fetch Existing Emails
  // -------------------------

  const total = mailbox.exists;

  const end = total - (page - 1) * limit;

  const start = Math.max(end - limit + 1, 1);

  const emails = [];

  for await (const msg of client.fetch(`${start}:${end}`, {
    uid: true,
    source: true,
    internalDate: true,
  })) {
    const parsed = await simpleParser(msg.source);

    emails.unshift({
      uid: msg.uid,
      from: parsed.from?.text || "",
      to: parsed.to?.text || "",
      subject: parsed.subject || "",
      text: parsed.text || "",
      html: parsed.html || "",
      date: parsed.date,
      attachments:
        parsed.attachments?.map((a) => ({
          filename: a.filename,
          size: a.size,
          type: a.contentType,
        })) || [],
    });
  }

  console.log("Fetched", emails.length, "emails");

  // -------------------------
  // Listen for new mails
  // -------------------------

  client.on("exists", async ({ path, count, prevCount }) => {
    try {
      //   const mailbox = await client.mailboxOpen("INBOX");

      const uid = client.mailbox.exists;

      const message = await client.fetchOne(uid, {
        uid: true,
        source: true,
      });

      if (!message) {
        return;
      }

      const parsed = await simpleParser(message.source);

      const mail = {
        uid: message.uid,
        from: parsed.from?.text || "",
        to: parsed.to?.text || "",
        subject: parsed.subject || "",
        text: parsed.text || "",
        html: parsed.html || "",
        date: parsed.date,
        attachments:
          parsed.attachments?.map((a) => ({
            filename: a.filename,
            size: a.size,
            type: a.contentType,
          })) || [],
      };

      console.log(mail);

      if (onNewMail) {
        onNewMail(mail);
      }
    } catch (err) {
      console.log(err);
    }
  });

  client.on("close", () => {
    console.log("Mailbox Closed :", email);
    clients.delete(userId);
  });

  client.on("error", (err) => {
    console.log(err);
  });

  return emails;
}

export async function disconnectMailbox(userId) {
  if (!clients.has(userId)) return;

  try {
    await clients.get(userId).logout();
  } catch (e) {}

  clients.delete(userId);
}

export function getMailbox(userId) {
  return clients.get(userId);
}

import nodemailer from "nodemailer";
import API from "../models/apiKeysModel.js";
import Cred from "../models/credModel.js";
import Template from "../models/templateModel.js";
import sentMails from "../models/sentMailDataModel.js";
import crypto from "crypto";
import 'dotenv/config';

const generateTrackingId = (currentRecipientMail) => {
  const hash = crypto
    .createHash("sha256")
    .update(currentRecipientMail + Date.now().toString())
    .digest("base64");

  return hash.replace(/[^a-zA-Z0-9]/g, "").substring(0, 50);
};

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

async function getTemplate(templateId) {
  try {
    const currentTemplateDetails = await Template.findById(templateId);

    if (!currentTemplateDetails) {
      throw new Error("No template found");
    }

    return {
      templateId: currentTemplateDetails._id,
      subject: currentTemplateDetails.subject,
      template: currentTemplateDetails.template,
    };
  } catch (error) {
    console.error("Failed to fetch template:", error.message);
    throw new Error("Unable to retrieve email template.");
  }
}

export async function sendMail(req, res) {
  try {
    const { to, credId, templateId, companyName, recipientName, apiKey } =
      req.body;

    if (!credId) throw new Error("Cred Id not sent");
    if (!apiKey) throw new Error("API Key not sent");
    if (!to || to.length === 0) throw new Error("No recipients defined.");
    if (!templateId) throw new Error("Template Id not provided.");

    const existingAPIKey = await API.findOne({ APIKEY: apiKey });
    if (!existingAPIKey) throw new Error("API expired or not registered");

    const CredData = await getCredentials(credId);
    const TemplateData = await getTemplate(templateId);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: CredData.email,
        pass: CredData.password,
      },
      debug: true,
    });

    let emailResponses = [];

    for (let i = 0; i < to.length; i++) {

      const currentRecipientMail = to[i];
      const currentRecipientName = recipientName[i];

      let generatedTrackingId;
      let isunique = false;

      while (!isunique) {
            generatedTrackingId = generateTrackingId(currentRecipientMail);
      
            const existingTrackingId = await sentMails.findOne({ uniqueIdforTracking: generatedTrackingId });
      
            if (!existingTrackingId) {
              isunique = true;
            }
          }


      let emailTemplate = TemplateData.template;
      emailTemplate = emailTemplate.replace(/\[CompanyName\]/g, companyName);
      emailTemplate = emailTemplate.replace(/\[RecipientName\]/g, currentRecipientName);

      const trackingPixelUrl = `https://emailing.rapydlaunch.com/api/v4/track-email?trackingId=${generatedTrackingId}`;

      emailTemplate = emailTemplate.replace('</body>', `<img src="${trackingPixelUrl}" width="1" height="1" style="display: none;"  alt=" " /></body>`);

      console.log(emailTemplate)

      const mailOptions = {
        from: CredData.email,
        to: currentRecipientMail,
        subject: TemplateData.subject,
        html: emailTemplate || undefined,
      };

      console.log("Mail options:", mailOptions);

      try {
        const mailSentResponse = await transporter.sendMail(mailOptions);
        console.log("Email sent response:", mailSentResponse);

        if (mailSentResponse.response.includes("250 2.0.0 OK")) {
          await sentMails.create({
            userId: req.userId,
            credId,
            from: CredData.email,
            to: req.body.to,
            currentRecipientMail,
            accepted: mailSentResponse.accepted,
            rejected: mailSentResponse.rejected,
            response: mailSentResponse.response,
            envelope: mailSentResponse.envelope,
            subject: TemplateData.subject,
            templateId: TemplateData.templateId,
            status: "sent",
            opened: false,
            uniqueIdforTracking:generatedTrackingId
          });

          emailResponses.push({
            email: currentRecipientMail,
            status: "sent",
            response: mailSentResponse.response,
          });
        } else {
          emailResponses.push({
            email: currentRecipientMail,
            status: "failed",
            response: "Email failed to send.",
          });
        }
      } catch (error) {
        console.error(`Failed to send email to ${currentRecipientMail}:`, error.message);
        emailResponses.push({
          email: currentRecipientMail,
          status: "failed",
          response: error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Email process completed",
      results: emailResponses,
    });
  } catch (error) {
    console.error("Failed to send email:", error.message);
    return res.status(500).json({ success: false, message: "Unable to send email." });
  }
}

export async function trackEmail(req, res) {
  console.log(process.env.BACKEND_URL)
  try {
    const { trackingId } = req.query;
    console.log("Tracking email for:", trackingId);

     if (!trackingId) {
       return res.status(400).json({ success: false, message: "Invalid request" });
     }

    const updateResult = await sentMails.updateOne(
      {uniqueIdforTracking:trackingId },
      { $set: { opened: true, status: "opened" } }
    );

    if (updateResult.matchedCount === 0) {
      console.warn(`No matching email found for tracking: ${trackingId}`);
    }
 
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/YnKqzIAAAAASUVORK5CYII=",
      "base64"
    );

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": pixel.length,
    });
    res.end(pixel);
  } catch (error) {
    console.error("Failed to track email:", error.message);
    res.status(500).send("Error tracking email");
  }
}

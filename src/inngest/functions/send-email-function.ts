import { inngest } from "../client";
import { sendHtmlMail } from "@/lib/nodemailer";
import { NonRetriableError } from "inngest";

/**
 * Sends an email using nodemailer
 * Triggered via event: "event/send-email"
 */
export const sendEmailFunction = inngest.createFunction(
  { id: "send-email", retries: 2 },
  { event: "event/send-email" },
  async ({ event }) => {
    const { to, subject, html } = event.data;

    // Basic validation to avoid useless retries
    if (!to || !subject || !html) {
      throw new NonRetriableError("Missing email fields");
    }

    try {
      await sendHtmlMail(to, subject, html);
      return { success: true };
    } catch (err) {
      console.error("Email send failed:", err);
      throw err; // allow retry
    }
  }
);
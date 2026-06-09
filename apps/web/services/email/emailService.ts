import { Resend } from "resend";
import {
  passwordResetEmailTemplate,
  verificationEmailTemplate,
  welcomeEmailTemplate,
} from "@/lib/email/templates";

type EmailPayload = {
  to: string;
  fullName?: string | null;
  actionUrl: string;
};

const from = process.env.RESEND_FROM_EMAIL ?? "StoneAI <onboarding@resend.dev>";

const getClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY.");
  return new Resend(apiKey);
};

export const emailService = {
  async sendVerificationEmail(payload: EmailPayload) {
    return getClient().emails.send({
      from,
      to: payload.to,
      subject: "Verify your StoneAI email",
      html: verificationEmailTemplate(payload),
    });
  },

  async sendPasswordResetEmail(payload: EmailPayload) {
    return getClient().emails.send({
      from,
      to: payload.to,
      subject: "Reset your StoneAI password",
      html: passwordResetEmailTemplate(payload),
    });
  },

  async sendWelcomeEmail(payload: EmailPayload) {
    return getClient().emails.send({
      from,
      to: payload.to,
      subject: "Welcome to StoneAI",
      html: welcomeEmailTemplate(payload),
    });
  },
};

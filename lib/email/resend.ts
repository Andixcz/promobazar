import "server-only";

import { Resend } from "resend";

let client: Resend | null | undefined;

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getResendClient(): Resend | null {
  if (client !== undefined) return client;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    client = null;
    return null;
  }
  client = new Resend(apiKey);
  return client;
}

export function getEmailFromAddress(): string {
  const from = process.env.EMAIL_FROM?.trim();
  if (from) return from;
  return "promobazar.cz <onboarding@resend.dev>";
}

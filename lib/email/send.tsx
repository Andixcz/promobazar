import "server-only";

import { render } from "@react-email/render";
import type { ReactElement } from "react";

import { getEmailFromAddress, getResendClient } from "@/lib/email/resend";

export type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; reason: "not_configured" | "send_failed" };

export async function sendReactEmail(input: {
  to: string;
  subject: string;
  react: ReactElement;
}): Promise<SendEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[email] RESEND_API_KEY chybí, e-mail „${input.subject}“ se neodeslal.`,
      );
    }
    return { ok: false, reason: "not_configured" };
  }

  const html = await render(input.react);
  const text = await render(input.react, { plainText: true });

  const { data, error } = await resend.emails.send({
    from: getEmailFromAddress(),
    to: input.to,
    subject: input.subject,
    html,
    text,
  });

  if (error) {
    console.error("[email] Resend error:", error);
    return { ok: false, reason: "send_failed" };
  }

  return { ok: true, id: data?.id };
}

import "server-only";

import OrderNotice from "@/emails/order-notice";
import { sendReactEmail } from "@/lib/email/send";
import { appPublicBaseUrl } from "@/lib/dashboard/platform-linking-oauth";
import { db } from "@/lib/db";
import { memberProfile, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ordersUrl = () => `${appPublicBaseUrl()}/dashboard/objednavky`;
const payoutUrl = () => `${appPublicBaseUrl()}/api/stripe/connect`;

async function addressFor(userId: string) {
  const [row] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  return row?.email ?? null;
}

async function payoutReady(userId: string) {
  const [row] = await db
    .select({ status: memberProfile.stripeTransfersStatus })
    .from(memberProfile)
    .where(eq(memberProfile.userId, userId))
    .limit(1);
  return row?.status === "active";
}

async function send(input: {
  userId: string;
  subject: string;
  title: string;
  paragraphs: string[];
  actionHref?: string;
  actionLabel?: string;
}) {
  const to = await addressFor(input.userId);
  if (!to) return;
  await sendReactEmail({
    to,
    subject: input.subject,
    react: OrderNotice({
      title: input.title,
      preview: input.paragraphs[0] ?? input.subject,
      paragraphs: input.paragraphs,
      actionHref: input.actionHref ?? ordersUrl(),
      actionLabel: input.actionLabel ?? "Otevřít objednávky",
    }),
  });
}

export async function notifyCreatorPaid(userId: string, title: string) {
  const ready = await payoutReady(userId);
  const paragraphs = [
    `Máš novou zakázku „${title}“. Platba je přijatá.`,
    "Na přijetí máš 48 hodin.",
  ];
  if (!ready) {
    paragraphs.push("Máš tu peníze. Zadej číslo účtu, ať ti je můžeme poslat.");
  }
  return send({
    userId,
    subject: "Nová zakázka",
    title: "Nová zakázka",
    paragraphs,
    actionHref: ready ? ordersUrl() : payoutUrl(),
    actionLabel: ready ? "Otevřít objednávky" : "Zadat účet",
  }).catch((error) => {
    console.error("[orders] notify creator", error);
  });
}

export function notifyClientRefunded(userId: string, title: string) {
  return send({
    userId,
    subject: "Platba za zakázku se vrací",
    title: "Platba se vrací",
    paragraphs: [
      `Zakázka „${title}“ nebyla přijata. Částka se vrací na kartu.`,
    ],
  }).catch((error) => {
    console.error("[orders] notify refund", error);
  });
}

export function notifyClientDelivered(userId: string, title: string) {
  return send({
    userId,
    subject: "Výstup čeká na schválení",
    title: "Výstup je hotový",
    paragraphs: [
      `Tvůrce odevzdal „${title}“.`,
      "Na schválení máš 3 dny.",
    ],
  }).catch((error) => {
    console.error("[orders] notify delivery", error);
  });
}

export function notifyCreatorPaidOut(userId: string, title: string) {
  return send({
    userId,
    subject: "Výplata za zakázku je na cestě",
    title: "Výplata odeslána",
    paragraphs: [
      `Za zakázku „${title}“ je výplata na cestě na tvůj účet.`,
    ],
  }).catch((error) => {
    console.error("[orders] notify payout", error);
  });
}

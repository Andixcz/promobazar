import "server-only";

import { and, eq } from "drizzle-orm";

import { appPublicBaseUrl } from "@/lib/dashboard/platform-linking-oauth";
import { db } from "@/lib/db";
import { creatorPackage, marketplaceOrder, memberProfile } from "@/lib/db/schema";
import { PLATFORM_FEE_BPS } from "@/lib/orders/money";
import { getStripe, stripeMissingMessage } from "@/lib/stripe";

type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

function integrationIdentifier() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let suffix = "";
  for (const byte of bytes) suffix += alphabet[byte % 26];
  return `pb-order-${suffix}`;
}

function cleanBrief(brief: string) {
  const value = brief.trim();
  if (value.length < 10) return "Brief musí mít aspoň 10 znaků.";
  if (value.length > 4000) return "Brief je příliš dlouhý.";
  return null;
}

async function openCheckout(orderId: string): Promise<CheckoutResult> {
  const stripe = getStripe();
  if (!stripe) return { ok: false, error: stripeMissingMessage() };

  const [order] = await db
    .select()
    .from(marketplaceOrder)
    .where(eq(marketplaceOrder.id, orderId))
    .limit(1);
  if (!order || order.status !== "pending_payment") {
    return { ok: false, error: "Tahle objednávka už nejde zaplatit." };
  }

  if (order.stripeCheckoutSessionId) {
    const existing = await stripe.checkout.sessions.retrieve(
      order.stripeCheckoutSessionId,
    );
    if (existing.status === "open" && existing.url) {
      return { ok: true, url: existing.url };
    }
  }

  const origin = appPublicBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: order.id,
    success_url: `${origin}/dashboard/objednavky?platba=ok`,
    cancel_url: `${origin}/dashboard/objednavky?platba=zruseno`,
    metadata: { orderId: order.id },
    integration_identifier: integrationIdentifier(),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "czk",
          unit_amount: order.amountCzk * 100,
          product_data: {
            name: order.title,
          },
        },
      },
    ],
    payment_intent_data: {
      metadata: { orderId: order.id },
    },
  });

  if (!session.url) return { ok: false, error: "Platbu se nepodařilo otevřít." };

  await db
    .update(marketplaceOrder)
    .set({ stripeCheckoutSessionId: session.id })
    .where(eq(marketplaceOrder.id, order.id));

  return { ok: true, url: session.url };
}

export async function resumeCheckout(orderId: string, clientUserId: string) {
  const [order] = await db
    .select({ id: marketplaceOrder.id })
    .from(marketplaceOrder)
    .where(
      and(
        eq(marketplaceOrder.id, orderId),
        eq(marketplaceOrder.clientUserId, clientUserId),
        eq(marketplaceOrder.status, "pending_payment"),
      ),
    )
    .limit(1);
  if (!order) return { ok: false as const, error: "Objednávku nejde zaplatit." };
  return openCheckout(order.id);
}

async function insertAndPay(input: {
  clientUserId: string;
  creatorUserId: string;
  title: string;
  brief: string;
  amountCzk: number;
  deliveryDays: number;
  revisionsAllowed: number;
  packageId: string | null;
}) {
  if (input.clientUserId === input.creatorUserId) {
    return { ok: false as const, error: "Vlastní balíček si objednat nejde." };
  }
  if (input.amountCzk < 100 || input.amountCzk > 500_000) {
    return { ok: false as const, error: "Částka musí být mezi 100 a 500 000 Kč." };
  }

  const id = crypto.randomUUID();
  await db.insert(marketplaceOrder).values({
    id,
    creatorUserId: input.creatorUserId,
    clientUserId: input.clientUserId,
    title: input.title,
    brief: input.brief,
    amountCzk: input.amountCzk,
    platformFeeBps: PLATFORM_FEE_BPS,
    deliveryDays: input.deliveryDays,
    revisionsAllowed: input.revisionsAllowed,
    packageId: input.packageId,
    status: "pending_payment",
  });

  try {
    const session = await openCheckout(id);
    if (!session.ok) {
      await db.delete(marketplaceOrder).where(eq(marketplaceOrder.id, id));
    }
    return session;
  } catch (error) {
    console.error("[orders] checkout", error);
    await db.delete(marketplaceOrder).where(eq(marketplaceOrder.id, id));
    return { ok: false as const, error: "Platbu se nepodařilo založit." };
  }
}

export async function startPackageCheckout(input: {
  clientUserId: string;
  packageId: string;
  brief: string;
}) {
  const briefError = cleanBrief(input.brief);
  if (briefError) return { ok: false as const, error: briefError };

  const [row] = await db
    .select({
      id: creatorPackage.id,
      name: creatorPackage.name,
      priceCzk: creatorPackage.priceCzk,
      deliveryDays: creatorPackage.deliveryDays,
      revisions: creatorPackage.revisions,
      creatorUserId: creatorPackage.userId,
    })
    .from(creatorPackage)
    .where(eq(creatorPackage.id, input.packageId))
    .limit(1);
  if (!row) return { ok: false as const, error: "Balíček neexistuje." };

  return insertAndPay({
    clientUserId: input.clientUserId,
    creatorUserId: row.creatorUserId,
    title: row.name,
    brief: input.brief.trim(),
    amountCzk: row.priceCzk,
    deliveryDays: row.deliveryDays,
    revisionsAllowed: Math.max(0, row.revisions),
    packageId: row.id,
  });
}

export async function startCustomCheckout(input: {
  clientUserId: string;
  creatorSlug: string;
  title: string;
  amountCzk: number;
  deliveryDays: number;
  brief: string;
}) {
  const briefError = cleanBrief(input.brief);
  if (briefError) return { ok: false as const, error: briefError };
  const title = input.title.trim();
  if (title.length < 3 || title.length > 120) {
    return { ok: false as const, error: "Název zakázky musí mít 3 až 120 znaků." };
  }
  if (!Number.isInteger(input.deliveryDays) || input.deliveryDays < 1 || input.deliveryDays > 60) {
    return { ok: false as const, error: "Termín doručení musí být 1 až 60 dní." };
  }
  if (!Number.isInteger(input.amountCzk)) {
    return { ok: false as const, error: "Částka musí být celé koruny." };
  }

  const slug = input.creatorSlug.trim().toLowerCase();
  const [creator] = await db
    .select({ userId: memberProfile.userId, role: memberProfile.role })
    .from(memberProfile)
    .where(eq(memberProfile.slug, slug))
    .limit(1);
  if (!creator || creator.role !== "creator") {
    return { ok: false as const, error: "Tvůrce jsme nenašli." };
  }

  return insertAndPay({
    clientUserId: input.clientUserId,
    creatorUserId: creator.userId,
    title,
    brief: input.brief.trim(),
    amountCzk: input.amountCzk,
    deliveryDays: input.deliveryDays,
    revisionsAllowed: 1,
    packageId: null,
  });
}

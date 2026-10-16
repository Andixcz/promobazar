import "server-only";

import { and, eq, inArray, lt } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  marketplaceOrder,
  memberProfile,
  type MarketplaceOrderStatus,
} from "@/lib/db/schema";
import {
  ACCEPT_WINDOW_MS,
  REVIEW_WINDOW_MS,
  splitChargeHalere,
} from "@/lib/orders/money";
import {
  notifyClientDelivered,
  notifyClientRefunded,
  notifyCreatorPaid,
  notifyCreatorPaidOut,
} from "@/lib/orders/notify";
import { readTransfersStatus } from "@/lib/orders/connect";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

type OrderRow = typeof marketplaceOrder.$inferSelect;

function fail(error: string) {
  return { ok: false as const, error };
}

async function loadOrder(orderId: string) {
  const [order] = await db
    .select()
    .from(marketplaceOrder)
    .where(eq(marketplaceOrder.id, orderId))
    .limit(1);
  return order ?? null;
}

async function transition(
  orderId: string,
  from: MarketplaceOrderStatus | MarketplaceOrderStatus[],
  patch: Partial<OrderRow>,
) {
  const fromList = Array.isArray(from) ? from : [from];
  const [row] = await db
    .update(marketplaceOrder)
    .set(patch)
    .where(
      and(
        eq(marketplaceOrder.id, orderId),
        inArray(marketplaceOrder.status, fromList),
      ),
    )
    .returning();
  return row ?? null;
}

async function chargeIdFor(order: OrderRow) {
  if (order.stripeChargeId) return order.stripeChargeId;
  const stripe = getStripe();
  if (!stripe || !order.stripePaymentIntentId) return null;
  const intent = await stripe.paymentIntents.retrieve(
    order.stripePaymentIntentId,
  );
  const charge =
    typeof intent.latest_charge === "string"
      ? intent.latest_charge
      : intent.latest_charge?.id;
  if (!charge) return null;
  await db
    .update(marketplaceOrder)
    .set({ stripeChargeId: charge })
    .where(eq(marketplaceOrder.id, order.id));
  return charge;
}

export async function markOrderPaid(input: {
  orderId: string;
  checkoutSessionId: string;
  paymentIntentId: string;
  amountTotal: number | null;
  currency: string | null;
}) {
  const order = await loadOrder(input.orderId);
  if (!order || order.status !== "pending_payment") return;
  const expected = order.amountCzk * 100;
  if (input.amountTotal !== expected || input.currency !== "czk") {
    console.error("[orders] checkout amount mismatch", input.orderId);
    return;
  }
  if (!input.paymentIntentId) return;

  const stripe = getStripe();
  let chargeId: string | null = null;
  if (stripe) {
    const intent = await stripe.paymentIntents.retrieve(input.paymentIntentId);
    chargeId =
      typeof intent.latest_charge === "string"
        ? intent.latest_charge
        : (intent.latest_charge?.id ?? null);
  }

  const updated = await transition(order.id, "pending_payment", {
    status: "awaiting_acceptance",
    stripeCheckoutSessionId: input.checkoutSessionId,
    stripePaymentIntentId: input.paymentIntentId,
    stripeChargeId: chargeId,
    acceptBy: new Date(Date.now() + ACCEPT_WINDOW_MS),
  });
  if (!updated) return;
  await notifyCreatorPaid(updated.creatorUserId, updated.title);
}

export async function refundOrder(orderId: string, actorUserId?: string) {
  const order = await loadOrder(orderId);
  if (!order) return fail("Zakázka neexistuje.");
  if (actorUserId && actorUserId !== order.creatorUserId) {
    return fail("Odmítnout může jen tvůrce.");
  }
  if (order.status !== "awaiting_acceptance") {
    return fail("Tuhle zakázku už nejde odmítnout.");
  }
  const stripe = getStripe();
  if (!stripe || !order.stripePaymentIntentId) {
    return fail("Platbu se nepodařilo vrátit.");
  }

  try {
    await stripe.refunds.create(
      { payment_intent: order.stripePaymentIntentId },
      { idempotencyKey: `refund-${order.id}` },
    );
  } catch (error) {
    const already =
      error instanceof Stripe.errors.StripeError &&
      error.code === "charge_already_refunded";
    if (!already) return fail("Platbu se nepodařilo vrátit.");
  }
  const updated = await transition(order.id, "awaiting_acceptance", {
    status: "refunded",
  });
  if (updated) await notifyClientRefunded(updated.clientUserId, updated.title);
  return { ok: true as const };
}

export async function acceptOrder(orderId: string, actorUserId: string) {
  const order = await loadOrder(orderId);
  if (!order || order.creatorUserId !== actorUserId) {
    return fail("Přijmout může jen tvůrce téhle zakázky.");
  }
  if (order.status !== "awaiting_acceptance") {
    return fail("Zakázka nečeká na přijetí.");
  }
  if (order.acceptBy && order.acceptBy.getTime() < Date.now()) {
    const refunded = await refundOrder(orderId);
    if (!refunded.ok) return refunded;
    return fail("Lhůta na přijetí vypršela. Platba se vrací.");
  }
  const updated = await transition(order.id, "awaiting_acceptance", {
    status: "in_progress",
    acceptedAt: new Date(),
    deliveryDueAt: new Date(Date.now() + order.deliveryDays * 24 * 60 * 60 * 1000),
  });
  if (!updated) return fail("Stav zakázky se mezitím změnil.");
  return { ok: true as const };
}

export async function deliverOrder(
  orderId: string,
  actorUserId: string,
  deliverableUrl: string,
) {
  const url = deliverableUrl.trim();
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return fail("Zadej platný odkaz.");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return fail("Odkaz musí být na http nebo https.");
  }
  if (url.length > 2000) return fail("Odkaz je příliš dlouhý.");

  const order = await loadOrder(orderId);
  if (!order || order.creatorUserId !== actorUserId) {
    return fail("Odevzdat může jen tvůrce.");
  }
  if (order.status !== "in_progress" && order.status !== "revision_requested") {
    return fail("Teď není co odevzdávat.");
  }
  const updated = await transition(
    order.id,
    ["in_progress", "revision_requested"],
    {
      status: "delivered",
      deliverableUrl: url,
      deliveredAt: new Date(),
      reviewDueAt: new Date(Date.now() + REVIEW_WINDOW_MS),
    },
  );
  if (!updated) return fail("Stav zakázky se mezitím změnil.");
  await notifyClientDelivered(updated.clientUserId, updated.title);
  return { ok: true as const };
}

export async function requestRevision(orderId: string, actorUserId: string) {
  const order = await loadOrder(orderId);
  if (!order || order.clientUserId !== actorUserId) {
    return fail("Úpravu může žádat jen zákazník.");
  }
  if (order.status !== "delivered") return fail("Výstup ještě není ke kontrole.");
  if (order.revisionCount >= order.revisionsAllowed) {
    return fail("Úprava už byla vyčerpaná. Výstup můžeš schválit.");
  }
  const updated = await transition(order.id, "delivered", {
    status: "revision_requested",
    revisionCount: order.revisionCount + 1,
    reviewDueAt: null,
  });
  if (!updated) return fail("Stav zakázky se mezitím změnil.");
  return { ok: true as const };
}

async function creatorCanReceive(creatorUserId: string) {
  const [profile] = await db
    .select({
      stripeAccountId: memberProfile.stripeAccountId,
    })
    .from(memberProfile)
    .where(eq(memberProfile.userId, creatorUserId))
    .limit(1);
  if (!profile?.stripeAccountId) return null;
  const status = await readTransfersStatus(profile.stripeAccountId);
  if (status !== "active") return null;
  await db
    .update(memberProfile)
    .set({ stripeTransfersStatus: "active" })
    .where(eq(memberProfile.userId, creatorUserId));
  return profile.stripeAccountId;
}

/** Schválení nebo auto-complete. Převod je idempotentní, dokončení až po něm. */
export async function releaseOrder(orderId: string) {
  const order = await loadOrder(orderId);
  if (!order) return fail("Zakázka neexistuje.");
  if (order.status === "completed") return { ok: true as const };
  if (order.status !== "delivered" && order.status !== "payout_pending") {
    return fail("Výplatu teď nejde uvolnit.");
  }

  if (order.status === "delivered") {
    const queued = await transition(order.id, "delivered", {
      status: "payout_pending",
    });
    if (!queued && (await loadOrder(orderId))?.status !== "payout_pending") {
      return fail("Stav zakázky se mezitím změnil.");
    }
  }

  const current = await loadOrder(orderId);
  if (!current || current.status === "completed") return { ok: true as const };
  if (current.status !== "payout_pending") {
    return fail("Výplatu teď nejde poslat.");
  }

  const destination = await creatorCanReceive(current.creatorUserId);
  const chargeId = await chargeIdFor(current);
  const stripe = getStripe();
  if (!stripe || !destination || !chargeId) {
    return { ok: true as const };
  }

  const { transferHalere } = splitChargeHalere(
    current.amountCzk,
    current.platformFeeBps,
  );
  if (transferHalere < 100) return fail("Částka k výplatě je příliš nízká.");

  let transfer: Stripe.Transfer;
  try {
    transfer = await stripe.transfers.create(
      {
        amount: transferHalere,
        currency: "czk",
        destination,
        source_transaction: chargeId,
      },
      { idempotencyKey: `transfer-${current.id}` },
    );
  } catch (error) {
    console.error("[orders] transfer", current.id, error);
    return { ok: true as const };
  }

  const updated = await transition(current.id, "payout_pending", {
    status: "completed",
    stripeTransferId: transfer.id,
    completedAt: new Date(),
  });
  if (updated) await notifyCreatorPaidOut(updated.creatorUserId, updated.title);
  return { ok: true as const };
}

export async function approveOrder(orderId: string, actorUserId: string) {
  const order = await loadOrder(orderId);
  if (!order || order.clientUserId !== actorUserId) {
    return fail("Schválit může jen zákazník.");
  }
  if (order.status !== "delivered") return fail("Není co schvalovat.");
  return releaseOrder(orderId);
}

export async function releasePendingForCreator(userId: string) {
  const rows = await db
    .select({ id: marketplaceOrder.id })
    .from(marketplaceOrder)
    .where(
      and(
        eq(marketplaceOrder.creatorUserId, userId),
        eq(marketplaceOrder.status, "payout_pending"),
      ),
    );
  for (const row of rows) {
    await releaseOrder(row.id).catch((error) => {
      console.error("[orders] release after connect", row.id, error);
    });
  }
}

export async function sweepDeadlines() {
  const now = new Date();
  const expired = await db
    .select({ id: marketplaceOrder.id })
    .from(marketplaceOrder)
    .where(
      and(
        eq(marketplaceOrder.status, "awaiting_acceptance"),
        lt(marketplaceOrder.acceptBy, now),
      ),
    );
  for (const row of expired) {
    await refundOrder(row.id).catch((error) => {
      console.error("[orders] accept timeout", row.id, error);
    });
  }

  const due = await db
    .select({ id: marketplaceOrder.id })
    .from(marketplaceOrder)
    .where(
      and(
        eq(marketplaceOrder.status, "delivered"),
        lt(marketplaceOrder.reviewDueAt, now),
      ),
    );
  const pending = await db
    .select({ id: marketplaceOrder.id })
    .from(marketplaceOrder)
    .where(eq(marketplaceOrder.status, "payout_pending"));

  const ids = [...due.map((row) => row.id), ...pending.map((row) => row.id)];
  for (const id of ids) {
    await releaseOrder(id).catch((error) => {
      console.error("[orders] release", id, error);
    });
  }
}

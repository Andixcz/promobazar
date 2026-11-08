import "server-only";

import { and, count, eq, inArray, or } from "drizzle-orm";

import { subscriptionIsEntitled } from "@/lib/billing/plans";
import { isActiveOrderStatus } from "@/lib/dashboard/marketplace-order";
import { getProfileByUserId } from "@/lib/dashboard/profile-server";
import { db } from "@/lib/db";
import {
  marketplaceOrder,
  type MarketplaceOrderStatus,
} from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";

const ACTIVE_ORDER_STATUSES = (
  [
    "pending_payment",
    "awaiting_acceptance",
    "in_progress",
    "delivered",
    "revision_requested",
    "payout_pending",
    "disputed",
  ] satisfies MarketplaceOrderStatus[]
).filter((s) => isActiveOrderStatus(s));

export type AccountDeletionEligibility =
  | { ok: true }
  | { ok: false; message: string };

async function hasStripeSubscription(customerId: string): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return false;

  for (const status of ["active", "trialing", "past_due"] as const) {
    const listed = await stripe.subscriptions.list({
      customer: customerId,
      status,
      limit: 1,
    });
    if (listed.data.length > 0) return true;
  }
  return false;
}

function hasEntitledSubscription(
  profile: Awaited<ReturnType<typeof getProfileByUserId>>,
): boolean {
  if (!profile) return false;
  const paidPlan =
    profile.billingPlan === "growth" || profile.billingPlan === "creator_pro";
  return paidPlan && subscriptionIsEntitled(profile.subscriptionStatus);
}

export async function assertCanDeleteAccount(
  userId: string,
): Promise<AccountDeletionEligibility> {
  const profile = await getProfileByUserId(userId);

  if (profile?.stripeCustomerId) {
    const stripeActive = await hasStripeSubscription(profile.stripeCustomerId);
    if (stripeActive || hasEntitledSubscription(profile)) {
      return {
        ok: false,
        message:
          "Máš aktivní předplatné. Nejdřív ho ukonči ve Stripe (Nastavení → Správa ve Stripe), pak smaž účet.",
      };
    }
  } else if (hasEntitledSubscription(profile)) {
    return {
      ok: false,
      message:
        "Máš aktivní předplatné. Nejdřív ho ukonči ve Stripe (Nastavení → Správa ve Stripe), pak smaž účet.",
    };
  }

  const [row] = await db
    .select({ total: count() })
    .from(marketplaceOrder)
    .where(
      and(
        or(
          eq(marketplaceOrder.creatorUserId, userId),
          eq(marketplaceOrder.clientUserId, userId),
        ),
        inArray(marketplaceOrder.status, ACTIVE_ORDER_STATUSES),
      ),
    );

  const activeOrders = row?.total ?? 0;
  if (activeOrders > 0) {
    return {
      ok: false,
      message:
        activeOrders === 1
          ? "Máš 1 rozjetou objednávku. Dokonči ji v Objednávkách, pak můžeš účet smazat."
          : `Máš ${activeOrders} rozjetých objednávek. Dokonči je v Objednávkách, pak můžeš účet smazat.`,
    };
  }

  return { ok: true };
}

import "server-only";

import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import {
  defaultBillingPlanForRole,
  subscriptionIsEntitled,
  type BillingPlanId,
  type SubscriptionStatus,
} from "@/lib/billing/plans";
import {
  billingPlanFromLookupKey,
  billingPlanFromStripePriceId,
} from "@/lib/billing/stripe-prices";
import { getProfileByUserId } from "@/lib/dashboard/profile-server";
import { db } from "@/lib/db";
import { memberProfile } from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";

function subscriptionStatusFromStripe(status: string): SubscriptionStatus {
  const allowed: SubscriptionStatus[] = [
    "active",
    "trialing",
    "past_due",
    "canceled",
    "unpaid",
    "incomplete",
    "incomplete_expired",
    "paused",
  ];
  if (allowed.includes(status as SubscriptionStatus)) {
    return status as SubscriptionStatus;
  }
  return "canceled";
}

async function resolveUserId(
  subscription: Stripe.Subscription,
): Promise<string | null> {
  const fromMeta = subscription.metadata?.userId?.trim();
  if (fromMeta) return fromMeta;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;
  if (!customerId) return null;

  const [row] = await db
    .select({ userId: memberProfile.userId })
    .from(memberProfile)
    .where(eq(memberProfile.stripeCustomerId, customerId))
    .limit(1);
  return row?.userId ?? null;
}

async function billingPlanFromSubscription(
  subscription: Stripe.Subscription,
  fallbackRolePlan: BillingPlanId,
): Promise<BillingPlanId> {
  const fromMeta = subscription.metadata?.billingPlan;
  if (fromMeta === "growth" || fromMeta === "creator_pro") {
    return fromMeta;
  }
  const item = subscription.items.data[0];
  const price = item?.price;
  if (price && typeof price === "object") {
    const fromLookup = billingPlanFromLookupKey(price.lookup_key);
    if (fromLookup) return fromLookup;
    if (price.id) {
      const mapped = await billingPlanFromStripePriceId(price.id);
      if (mapped) return mapped;
    }
  }
  return fallbackRolePlan;
}

export async function applySubscriptionState(
  subscription: Stripe.Subscription,
) {
  const userId = await resolveUserId(subscription);
  if (!userId) return;

  const profile = await getProfileByUserId(userId);
  if (!profile) return;

  const status = subscriptionStatusFromStripe(subscription.status);
  const entitled = subscriptionIsEntitled(status);
  const paidPlan = await billingPlanFromSubscription(
    subscription,
    profile.role === "creator" ? "creator_pro" : "growth",
  );

  const billingPlan: BillingPlanId = entitled
    ? paidPlan
    : defaultBillingPlanForRole(profile.role);

  await db
    .update(memberProfile)
    .set({
      stripeSubscriptionId: entitled ? subscription.id : null,
      subscriptionStatus: status,
      billingPlan,
    })
    .where(eq(memberProfile.userId, userId));
}

/** Po návratu z Checkout (dřív než dorazí webhook) nebo jako doplnění webhooku. */
export async function refreshUserBillingFromStripe(
  userId: string,
  checkoutSessionId?: string | null,
) {
  const stripe = getStripe();
  if (!stripe) return;

  const sessionId = checkoutSessionId?.trim();
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const owner =
        session.metadata?.userId?.trim() || session.client_reference_id?.trim();
      if (owner === userId && session.mode === "subscription") {
        await syncSubscriptionCheckoutSession(session);
        return;
      }
    } catch {
      // ponytail: session_id invalid or Stripe blip — fall back to customer list
    }
  }

  const profile = await getProfileByUserId(userId);
  if (!profile?.stripeCustomerId) return;

  for (const status of ["active", "trialing", "past_due"] as const) {
    const listed = await stripe.subscriptions.list({
      customer: profile.stripeCustomerId,
      status,
      limit: 1,
    });
    const sub = listed.data[0];
    if (sub) {
      await applySubscriptionState(sub);
      return;
    }
  }
}

export async function syncSubscriptionCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  if (session.mode !== "subscription") return;
  const stripe = getStripe();
  if (!stripe) return;

  const subscriptionRef = session.subscription;
  const subscriptionId =
    typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef?.id;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await applySubscriptionState(subscription);

  const userId = session.metadata?.userId ?? session.client_reference_id;
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (userId && customerId) {
    await db
      .update(memberProfile)
      .set({ stripeCustomerId: customerId })
      .where(eq(memberProfile.userId, userId));
  }
}

import "server-only";

import { eq } from "drizzle-orm";

import {
  billingPlanForSubscriptionPlan,
  canSubscribeToPlan,
  subscriptionIsEntitled,
  subscriptionPlanDeniedMessage,
  type SubscriptionPlanId,
} from "@/lib/billing/plans";
import { getSubscriptionPriceId } from "@/lib/billing/stripe-prices";
import { appPublicBaseUrl } from "@/lib/dashboard/platform-linking-oauth";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { db } from "@/lib/db";
import { memberProfile } from "@/lib/db/schema";
import { getStripe, stripeMissingMessage } from "@/lib/stripe";

type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

function integrationIdentifier() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let suffix = "";
  for (const byte of bytes) suffix += alphabet[byte % 26];
  return `pb-sub-${suffix}`;
}

function cancelUrl(plan: SubscriptionPlanId) {
  const origin = appPublicBaseUrl();
  if (plan === "growth") return `${origin}/#cenik`;
  return `${origin}/pro-tvurce#creator-pro`;
}

function successUrl(plan: SubscriptionPlanId) {
  const origin = appPublicBaseUrl();
  return `${origin}/dashboard/nastaveni?predplatne=ok&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`;
}

async function ensureStripeCustomer(
  stripe: NonNullable<ReturnType<typeof getStripe>>,
  profile: MemberProfileRow,
  email: string,
) {
  if (profile.stripeCustomerId) {
    return profile.stripeCustomerId;
  }
  const customer = await stripe.customers.create({
    email,
    metadata: { userId: profile.userId },
  });
  await db
    .update(memberProfile)
    .set({ stripeCustomerId: customer.id })
    .where(eq(memberProfile.userId, profile.userId));
  return customer.id;
}

export async function startSubscriptionCheckout(input: {
  profile: MemberProfileRow;
  email: string;
  plan: SubscriptionPlanId;
}): Promise<CheckoutResult> {
  const { profile, email, plan } = input;
  const stripe = getStripe();
  if (!stripe) return { ok: false, error: stripeMissingMessage() };

  if (!canSubscribeToPlan(profile.role, plan)) {
    return { ok: false, error: subscriptionPlanDeniedMessage(plan) };
  }

  const priceId = await getSubscriptionPriceId(plan);
  if (!priceId) {
    return {
      ok: false,
      error: "Cenu předplatného se nepodařilo načíst ze Stripe.",
    };
  }

  const billingPlan = billingPlanForSubscriptionPlan(plan);
  if (
    subscriptionIsEntitled(profile.subscriptionStatus) &&
    profile.billingPlan === billingPlan
  ) {
    return { ok: false, error: "Tenhle plán už máš aktivní." };
  }

  const customerId = await ensureStripeCustomer(stripe, profile, email);

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: profile.userId,
      metadata: {
        userId: profile.userId,
        billingPlan,
        subscriptionPlan: plan,
      },
      subscription_data: {
        metadata: {
          userId: profile.userId,
          billingPlan,
        },
      },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl(plan),
      cancel_url: cancelUrl(plan),
      integration_identifier: integrationIdentifier(),
    });
  } catch (error) {
    console.error("[billing] checkout.sessions.create", error);
    const message =
      error instanceof Error ? error.message : "Checkout se nepodařil vytvořit.";
    return { ok: false, error: message };
  }

  if (!session.url) {
    return { ok: false, error: "Checkout se nepodařil otevřít." };
  }
  return { ok: true, url: session.url };
}

export async function openBillingPortal(profile: MemberProfileRow) {
  const stripe = getStripe();
  if (!stripe) return { ok: false as const, error: stripeMissingMessage() };
  if (!profile.stripeCustomerId) {
    return { ok: false as const, error: "Nemáš žádné předplatné." };
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripeCustomerId,
    return_url: `${appPublicBaseUrl()}/dashboard/nastaveni`,
  });
  return { ok: true as const, url: session.url };
}

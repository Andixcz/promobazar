import "server-only";

import type { SubscriptionPlanId } from "@/lib/billing/plans";
import type { BillingPlanId } from "@/lib/billing/plans";
import { getStripe } from "@/lib/stripe";

/** Musí sedět s lookup_key ve Stripe Dashboard. */
export const SUBSCRIPTION_PRICE_LOOKUP_KEYS: Record<SubscriptionPlanId, string> = {
  growth: "promobazar_growth_monthly",
  creator_pro: "promobazar_creator_pro_monthly",
};

const LOOKUP_TO_PLAN: Record<string, BillingPlanId> = {
  [SUBSCRIPTION_PRICE_LOOKUP_KEYS.growth]: "growth",
  [SUBSCRIPTION_PRICE_LOOKUP_KEYS.creator_pro]: "creator_pro",
};

const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheRow = { priceId: string; lookupKey: string; expiresAt: number };

const priceIdCache = new Map<SubscriptionPlanId, CacheRow>();
const priceIdToPlan = new Map<string, BillingPlanId>();

function rememberPrice(plan: SubscriptionPlanId, priceId: string, lookupKey: string) {
  priceIdCache.set(plan, {
    priceId,
    lookupKey,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
  const billingPlan = LOOKUP_TO_PLAN[lookupKey];
  if (billingPlan) priceIdToPlan.set(priceId, billingPlan);
}

export function billingPlanFromLookupKey(
  lookupKey: string | null | undefined,
): BillingPlanId | null {
  if (!lookupKey) return null;
  return LOOKUP_TO_PLAN[lookupKey] ?? null;
}

export async function getSubscriptionPriceId(
  plan: SubscriptionPlanId,
): Promise<string | null> {
  const cached = priceIdCache.get(plan);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.priceId;
  }

  const stripe = getStripe();
  if (!stripe) return null;

  const lookupKey = SUBSCRIPTION_PRICE_LOOKUP_KEYS[plan];
  const listed = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });
  const price = listed.data[0];
  if (!price?.id) return null;

  rememberPrice(plan, price.id, lookupKey);
  return price.id;
}

export async function billingPlanFromStripePriceId(
  priceId: string,
): Promise<BillingPlanId | null> {
  const memo = priceIdToPlan.get(priceId);
  if (memo) return memo;

  const stripe = getStripe();
  if (!stripe) return null;

  try {
    const price = await stripe.prices.retrieve(priceId);
    const fromLookup = billingPlanFromLookupKey(price.lookup_key);
    if (fromLookup) {
      priceIdToPlan.set(priceId, fromLookup);
      return fromLookup;
    }
  } catch {
    return null;
  }
  return null;
}

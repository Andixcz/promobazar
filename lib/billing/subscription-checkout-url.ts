import type { SubscriptionPlanId } from "@/lib/billing/plans";

/** Veřejná URL pro start Stripe Checkout předplatného. */
export const SUBSCRIPTION_CHECKOUT_PATH = "/predplatne";

export function subscriptionCheckoutHref(plan: SubscriptionPlanId): string {
  return `${SUBSCRIPTION_CHECKOUT_PATH}?plan=${plan}`;
}

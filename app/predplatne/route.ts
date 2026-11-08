import { respondSubscriptionCheckout } from "@/lib/billing/subscription-checkout-http";

export const runtime = "nodejs";

/** Veřejný vstup: `/predplatne?plan=growth` | `creator_pro` → Stripe Checkout. */
export async function GET(request: Request) {
  return respondSubscriptionCheckout(request);
}

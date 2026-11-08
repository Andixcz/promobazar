/**
 * Alias pro Stripe CLI (`stripe listen --forward-to localhost:3000/webhook`).
 * Produkční endpoint zůstává `/api/stripe/webhook`.
 */
import { handleStripeWebhook } from "@/lib/stripe/webhook-handler";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleStripeWebhook(request);
}

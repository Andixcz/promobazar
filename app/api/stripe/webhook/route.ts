import { handleStripeWebhook } from "@/lib/stripe/webhook-handler";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleStripeWebhook(request);
}

import "server-only";

import { NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  applySubscriptionState,
  syncSubscriptionCheckoutSession,
} from "@/lib/billing/subscription-sync";
import { markOrderPaid } from "@/lib/orders/lifecycle";
import { getStripe } from "@/lib/stripe";

export async function handleStripeWebhook(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe není nastavené." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Chybí podpis." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Neplatný podpis." }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode === "subscription") {
      await syncSubscriptionCheckoutSession(session);
    } else if (session.payment_status === "paid") {
      const paymentIntent = session.payment_intent;
      const paymentIntentId =
        typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id;
      const orderId = session.metadata?.orderId || session.client_reference_id;
      if (orderId && paymentIntentId) {
        await markOrderPaid({
          orderId,
          checkoutSessionId: session.id,
          paymentIntentId,
          amountTotal: session.amount_total,
          currency: session.currency,
        });
      }
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    await applySubscriptionState(event.data.object as Stripe.Subscription);
  }

  if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription?: string | Stripe.Subscription | null;
    };
    const subscriptionRef = invoice.subscription;
    const subscriptionId =
      typeof subscriptionRef === "string"
        ? subscriptionRef
        : subscriptionRef?.id;
    const stripeClient = getStripe();
    if (stripeClient && subscriptionId) {
      const subscription =
        await stripeClient.subscriptions.retrieve(subscriptionId);
      await applySubscriptionState(subscription);
    }
  }

  return NextResponse.json({ received: true });
}

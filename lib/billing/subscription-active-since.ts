import "server-only";

import { subscriptionIsEntitled } from "@/lib/billing/plans";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { getStripe } from "@/lib/stripe";

/** Datum založení aktivní Stripe subscription (start_date). */
export async function getSubscriptionActiveSince(
  profile: MemberProfileRow,
): Promise<Date | null> {
  if (!subscriptionIsEntitled(profile.subscriptionStatus)) return null;

  const subId = profile.stripeSubscriptionId?.trim();
  if (!subId) return null;

  const stripe = getStripe();
  if (!stripe) return null;

  try {
    const sub = await stripe.subscriptions.retrieve(subId);
    return new Date(sub.start_date * 1000);
  } catch {
    return null;
  }
}

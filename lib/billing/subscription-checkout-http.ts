import "server-only";

import { NextResponse } from "next/server";

import { startSubscriptionCheckout } from "@/lib/billing/subscription-checkout";
import {
  subscriptionPlanIds,
  type SubscriptionPlanId,
} from "@/lib/billing/plans";
import {
  checkoutBlockReasonForMessage,
  messageFromCheckoutFailure,
  subscriptionCheckoutErrorHref,
} from "@/lib/billing/subscription-checkout-errors";
import { subscriptionCheckoutHref } from "@/lib/billing/subscription-checkout-url";
import { getServerSession } from "@/lib/auth-session";
import { AUTH_LOGIN_PATH } from "@/lib/auth-routes";
import { ensureMemberProfile } from "@/lib/dashboard/profile-server";

function parsePlan(value: string | null): SubscriptionPlanId | null {
  if (!value) return null;
  return subscriptionPlanIds.includes(value as SubscriptionPlanId)
    ? (value as SubscriptionPlanId)
    : null;
}

export async function respondSubscriptionCheckout(request: Request) {
  const url = new URL(request.url);
  const plan = parsePlan(url.searchParams.get("plan"));
  if (!plan) {
    return NextResponse.redirect(
      new URL(
        subscriptionCheckoutErrorHref({
          msg: "Neplatný nebo chybějící plán. Použij ?plan=growth nebo ?plan=creator_pro.",
        }),
        url.origin,
      ),
    );
  }

  const session = await getServerSession();
  const checkoutPath = subscriptionCheckoutHref(plan);
  if (!session?.user) {
    const login = new URL(AUTH_LOGIN_PATH, url.origin);
    login.searchParams.set("callbackUrl", checkoutPath);
    return NextResponse.redirect(login);
  }

  try {
    const profile = await ensureMemberProfile(
      session.user.id,
      session.user.name,
      session.user.email,
    );

    const result = await startSubscriptionCheckout({
      profile,
      email: session.user.email,
      plan,
    });
    if (!result.ok) {
      return NextResponse.redirect(
        new URL(
          subscriptionCheckoutErrorHref({
            plan,
            msg: result.error,
            reason: checkoutBlockReasonForMessage(plan, result.error),
          }),
          url.origin,
        ),
      );
    }
    return NextResponse.redirect(result.url);
  } catch (error) {
    console.error("[billing] checkout", error);
    return NextResponse.redirect(
      new URL(
        subscriptionCheckoutErrorHref({
          plan,
          msg: messageFromCheckoutFailure(error),
        }),
        url.origin,
      ),
    );
  }
}

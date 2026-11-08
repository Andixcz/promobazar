import type { Metadata } from "next";
import Link from "next/link";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SiteShell } from "@/components/shared/site-shell";
import { Button } from "@/components/ui/button";
import {
  subscriptionPlanIds,
  type SubscriptionPlanId,
} from "@/lib/billing/plans";
import { userFacingCheckoutError } from "@/lib/billing/subscription-checkout-errors";
import {
  subscriptionCheckoutErrorReasons,
  type SubscriptionCheckoutErrorReason,
} from "@/lib/billing/subscription-checkout-errors";
import { subscriptionCheckoutHref } from "@/lib/billing/subscription-checkout-url";
import { AUTH_REGISTER_PATH } from "@/lib/auth-routes";
import { getServerSession } from "@/lib/auth-session";
import { getProfileByUserId } from "@/lib/dashboard/profile-server";
import { dashboardPath } from "@/lib/dashboard-routes";
import type { MemberRole } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Platba",
  robots: { index: false, follow: false },
};

function parsePlan(value: string | undefined): SubscriptionPlanId | null {
  if (!value) return null;
  return subscriptionPlanIds.includes(value as SubscriptionPlanId)
    ? (value as SubscriptionPlanId)
    : null;
}

function parseReason(
  value: string | undefined,
): SubscriptionCheckoutErrorReason | null {
  if (!value) return null;
  return subscriptionCheckoutErrorReasons.includes(
    value as SubscriptionCheckoutErrorReason,
  )
    ? (value as SubscriptionCheckoutErrorReason)
    : null;
}

function wrongRoleDescription(
  plan: SubscriptionPlanId,
  role: MemberRole | undefined,
  loggedIn: boolean,
  fallback: string,
): string {
  if (!loggedIn) return fallback;
  if (plan === "growth" && role === "creator") {
    return "Jsi přihlášený jako tvůrce. Growth je jen pro účet značky. Pro tvůrce máme Creator PRO.";
  }
  if (
    plan === "creator_pro" &&
    (role === "brand" || role === "buyer")
  ) {
    return "Jsi přihlášený jako značka. Creator PRO je jen pro tvůrce. Pro značky je plán Growth.";
  }
  return fallback;
}

export default async function SubscriptionCheckoutErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; msg?: string; reason?: string }>;
}) {
  const { plan: planRaw, msg: msgRaw, reason: reasonRaw } = await searchParams;
  const plan = parsePlan(planRaw);
  const reason = parseReason(reasonRaw);
  const session = await getServerSession();
  const profile = session?.user
    ? await getProfileByUserId(session.user.id)
    : null;
  const loggedIn = Boolean(session?.user);
  const fallback = userFacingCheckoutError(msgRaw ?? "");
  const description =
    reason === "wrong_role" && plan
      ? wrongRoleDescription(plan, profile?.role, loggedIn, fallback)
      : fallback;
  const showRetry = plan && reason !== "wrong_role" && reason !== "active_plan";

  return (
    <SiteShell>
      <AuthPageShell
        title="Platbu se nepodařilo otevřít"
        description={description}
      >
        <div className="flex flex-col gap-2">
          {reason === "wrong_role" && plan === "growth" && loggedIn ? (
            <>
              {profile?.role === "creator" ? (
                <Button type="button" className="w-full" asChild>
                  <a href={subscriptionCheckoutHref("creator_pro")}>
                    Zapnout Creator PRO
                  </a>
                </Button>
              ) : null}
              <Button type="button" className="w-full" variant="outline" asChild>
                <Link href={dashboardPath("nastaveni")}>Přejít do dashboardu</Link>
              </Button>
            </>
          ) : null}
          {reason === "wrong_role" &&
          plan === "creator_pro" &&
          loggedIn &&
          (profile?.role === "brand" || profile?.role === "buyer") ? (
            <>
              <Button type="button" className="w-full" asChild>
                <a href={subscriptionCheckoutHref("growth")}>Přejít na Growth</a>
              </Button>
              <Button type="button" className="w-full" variant="outline" asChild>
                <Link href={dashboardPath("nastaveni")}>Přejít do dashboardu</Link>
              </Button>
            </>
          ) : null}
          {reason === "wrong_role" && plan === "growth" && !loggedIn ? (
            <Button type="button" className="w-full" variant="outline" asChild>
              <Link href={`${AUTH_REGISTER_PATH}?role=brand`}>Registrace značky</Link>
            </Button>
          ) : null}
          {reason === "wrong_role" && plan === "creator_pro" && !loggedIn ? (
            <Button type="button" className="w-full" variant="outline" asChild>
              <Link href={`${AUTH_REGISTER_PATH}?role=creator`}>
                Registrace tvůrce
              </Link>
            </Button>
          ) : null}
          {showRetry && plan ? (
            <Button type="button" className="w-full" asChild>
              <a href={subscriptionCheckoutHref(plan)}>Zkusit znovu</a>
            </Button>
          ) : null}
        </div>
      </AuthPageShell>
    </SiteShell>
  );
}

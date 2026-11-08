import type { Metadata } from "next";
import { Suspense } from "react";

import { AccountSettingsPanel } from "@/components/dashboard/account-settings-panel";
import { BillingPlanCard } from "@/components/dashboard/billing-plan-card";
import { SubscriptionSuccessModal } from "@/components/dashboard/subscription-success-modal";
import { StripePayoutCard } from "@/components/dashboard/stripe-payout-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  brandHasGrowth,
  creatorHasPro,
} from "@/lib/billing/plans";
import { getSubscriptionActiveSince } from "@/lib/billing/subscription-active-since";
import { refreshUserBillingFromStripe } from "@/lib/billing/subscription-sync";
import { getAccountAuthContext } from "@/lib/auth-account-server";
import { listConfiguredSocialAuthProviders } from "@/lib/auth-social-server";
import { assertCanDeleteAccount } from "@/lib/dashboard/account-deletion-guard";
import { getProfileByUserId } from "@/lib/dashboard/profile-server";
import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

export const metadata: Metadata = {
  title: "Nastavení",
};

export default async function DashboardAccountSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    vyplata?: string;
    predplatne?: string;
    plan?: string;
    session_id?: string;
    msg?: string;
  }>;
}) {
  const { profile: initialProfile, session } = await requireDashboard(
    dashboardPath("nastaveni"),
  );
  const { vyplata, predplatne, msg, session_id } = await searchParams;
  let profile = initialProfile;

  const paidPlanMismatch =
    profile.stripeCustomerId &&
    ((profile.role === "creator" && !creatorHasPro(profile)) ||
      ((profile.role === "brand" || profile.role === "buyer") &&
        !brandHasGrowth(profile)));

  if (predplatne === "ok" || paidPlanMismatch) {
    await refreshUserBillingFromStripe(session.user.id, session_id);
    const refreshed = await getProfileByUserId(session.user.id);
    if (refreshed) profile = refreshed;
  }

  const account = await getAccountAuthContext();
  if (!account) {
    return null;
  }

  const deleteEligibility = await assertCanDeleteAccount(session.user.id);
  const deleteBlockReason = deleteEligibility.ok ? null : deleteEligibility.message;
  const subscriptionActiveSince = await getSubscriptionActiveSince(profile);

  return (
    <DashboardShell title="Nastavení" description="Účet a přihlášení.">
      <Suspense fallback={null}>
        <SubscriptionSuccessModal />
      </Suspense>
      <div className="max-w-2xl space-y-8">
        {predplatne === "chyba" && msg ? (
          <p className="text-sm text-rose" role="alert">
            {msg}
          </p>
        ) : null}
        <BillingPlanCard
          profile={profile}
          activeSince={subscriptionActiveSince}
        />
        {profile.role === "creator" ? (
          <StripePayoutCard
            status={profile.stripeTransfersStatus}
            notice={vyplata}
          />
        ) : null}
        <AccountSettingsPanel
          email={account.email}
          emailVerified={account.emailVerified}
          hasCredential={account.hasCredential}
          accounts={account.accounts}
          configuredSocialProviders={listConfiguredSocialAuthProviders()}
          deleteBlockReason={deleteBlockReason}
        />
      </div>
    </DashboardShell>
  );
}

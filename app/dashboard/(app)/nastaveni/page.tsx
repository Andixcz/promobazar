import { AccountSettingsPanel } from "@/components/dashboard/account-settings-panel";
import { StripePayoutCard } from "@/components/dashboard/stripe-payout-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getAccountAuthContext } from "@/lib/auth-account-server";
import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

export default async function DashboardAccountSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ vyplata?: string }>;
}) {
  const { profile } = await requireDashboard(dashboardPath("nastaveni"));
  const { vyplata } = await searchParams;
  const account = await getAccountAuthContext();
  if (!account) {
    return null;
  }

  return (
    <DashboardShell title="Nastavení" description="Účet a přihlášení.">
      <div className="space-y-6">
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
          providers={account.providers}
        />
      </div>
    </DashboardShell>
  );
}

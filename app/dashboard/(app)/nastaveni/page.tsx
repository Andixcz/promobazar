import { AccountSettingsPanel } from "@/components/dashboard/account-settings-panel";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getAccountAuthContext } from "@/lib/auth-account-server";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

export default async function DashboardAccountSettingsPage() {
  await requireDashboard();
  const account = await getAccountAuthContext();
  if (!account) {
    return null;
  }

  return (
    <DashboardShell title="Nastavení" description="Účet a přihlášení.">
      <AccountSettingsPanel
        email={account.email}
        emailVerified={account.emailVerified}
        hasCredential={account.hasCredential}
        providers={account.providers}
      />
    </DashboardShell>
  );
}

import { AccountSettingsPanel } from "@/components/dashboard/account-settings-panel";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

export default async function DashboardAccountSettingsPage() {
  const { session } = await requireDashboard();

  return (
    <DashboardShell title="Nastavení" description="Účet a přihlášení.">
      <AccountSettingsPanel email={session.user.email} />
    </DashboardShell>
  );
}

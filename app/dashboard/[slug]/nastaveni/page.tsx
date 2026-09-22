import { AccountSettingsPanel } from "@/components/dashboard/account-settings-panel";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireDashboardProfile } from "@/lib/dashboard/require-dashboard";

type PageProps = { params: Promise<{ slug: string }> };

export default async function DashboardAccountSettingsPage({ params }: PageProps) {
  const { slug } = await params;
  const { session } = await requireDashboardProfile(slug);

  return (
    <DashboardShell title="Nastavení" description="Účet a přihlášení.">
      <AccountSettingsPanel email={session.user.email} />
    </DashboardShell>
  );
}

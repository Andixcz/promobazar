import { redirect } from "next/navigation";

import { CreatorPackageEditor } from "@/components/dashboard/creator-package-editor";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

export default async function DashboardNewPackagePage() {
  const { profile } = await requireDashboard();

  if (profile.role !== "creator") {
    redirect(dashboardPath());
  }

  return (
    <DashboardShell
      title="Nový balíček"
      description="Nastav cenu, formát a co balíček obsahuje."
    >
      <CreatorPackageEditor mode="create" />
    </DashboardShell>
  );
}

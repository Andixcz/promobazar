import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { CreatorPackagesPanel } from "@/components/dashboard/creator-packages-panel";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";
import { db } from "@/lib/db";
import { creatorPackage } from "@/lib/db/schema";

export default async function DashboardPackagesPage() {
  const { profile } = await requireDashboard();

  if (profile.role !== "creator") {
    redirect(dashboardPath());
  }

  const packages = await db
    .select()
    .from(creatorPackage)
    .where(eq(creatorPackage.userId, profile.userId))
    .orderBy(asc(creatorPackage.sortOrder), asc(creatorPackage.createdAt));

  return (
    <DashboardShell
      title="Balíčky"
      description="Nabídky, které značky vidí na tvém profilu v tržišti."
    >
      <CreatorPackagesPanel profile={profile} packages={packages} />
    </DashboardShell>
  );
}

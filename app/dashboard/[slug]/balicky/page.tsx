import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { CreatorPackagesPanel } from "@/components/dashboard/creator-packages-panel";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboardProfile } from "@/lib/dashboard/require-dashboard";
import { db } from "@/lib/db";
import { creatorPackage } from "@/lib/db/schema";

type PageProps = { params: Promise<{ slug: string }> };

export default async function DashboardPackagesPage({ params }: PageProps) {
  const { slug } = await params;
  const { profile } = await requireDashboardProfile(slug);

  if (profile.role !== "creator") {
    redirect(dashboardPath(profile.slug));
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

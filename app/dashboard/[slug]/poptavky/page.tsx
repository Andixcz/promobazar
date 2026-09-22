import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { BrandJobsPanel } from "@/components/dashboard/brand-jobs-panel";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboardProfile } from "@/lib/dashboard/require-dashboard";
import { db } from "@/lib/db";
import { brandJobPost } from "@/lib/db/schema";

type PageProps = { params: Promise<{ slug: string }> };

export default async function DashboardJobsPage({ params }: PageProps) {
  const { slug } = await params;
  const { profile } = await requireDashboardProfile(slug);

  if (profile.role !== "brand") {
    redirect(dashboardPath(profile.slug));
  }

  const jobs = await db
    .select()
    .from(brandJobPost)
    .where(eq(brandJobPost.userId, profile.userId))
    .orderBy(desc(brandJobPost.createdAt));

  return (
    <DashboardShell
      title="Poptávky"
      description="Spravuj aktivní zakázky pro tvůrce v tržišti."
    >
      <BrandJobsPanel profile={profile} jobs={jobs} />
    </DashboardShell>
  );
}

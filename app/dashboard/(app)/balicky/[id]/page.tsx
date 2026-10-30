import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CreatorPackageEditor } from "@/components/dashboard/creator-package-editor";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";
import { db } from "@/lib/db";
import { creatorPackage } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Upravit balíček",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardEditPackagePage({ params }: PageProps) {
  const { id } = await params;
  const { profile } = await requireDashboard();

  if (profile.role !== "creator") {
    redirect(dashboardPath());
  }

  const [pkg] = await db
    .select()
    .from(creatorPackage)
    .where(
      and(eq(creatorPackage.id, id), eq(creatorPackage.userId, profile.userId)),
    )
    .limit(1);

  if (!pkg) {
    notFound();
  }

  return (
    <DashboardShell title="Upravit balíček">
      <CreatorPackageEditor mode="edit" packageId={pkg.id} initial={pkg} />
    </DashboardShell>
  );
}

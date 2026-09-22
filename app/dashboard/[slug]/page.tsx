import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BrandOverview } from "@/components/dashboard/brand-overview";
import { CreatorOverview } from "@/components/dashboard/creator-overview";
import { count, eq } from "drizzle-orm";

import { requireDashboardProfile } from "@/lib/dashboard/require-dashboard";
import { db } from "@/lib/db";
import { brandJobPost } from "@/lib/db/schema";

type PageProps = { params: Promise<{ slug: string }> };

export default async function DashboardOverviewPage({ params }: PageProps) {
  const { slug } = await params;
  const { profile } = await requireDashboardProfile(slug);

  let jobCount = 0;
  if (profile.role === "brand") {
    const [row] = await db
      .select({ total: count() })
      .from(brandJobPost)
      .where(eq(brandJobPost.userId, profile.userId));
    jobCount = row?.total ?? 0;
  }

  const title =
    profile.role === "creator"
      ? "Dashboard pro tvůrce"
      : "Panel pro značky";

  const description =
    profile.role === "creator"
      ? "Přehled objednávek a místo pro budoucí nahrávání hotového obsahu."
      : "Přehled poptávek a spoluprací se tvůrci na jednom místě.";

  return (
    <DashboardShell title={title} description={description}>
      {profile.role === "creator" ? (
        <CreatorOverview profile={profile} />
      ) : (
        <BrandOverview profile={profile} jobCount={jobCount} />
      )}
    </DashboardShell>
  );
}

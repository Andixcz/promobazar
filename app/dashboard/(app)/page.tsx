import { count, eq } from "drizzle-orm";
import type { Metadata } from "next";

import { BrandOverview } from "@/components/dashboard/brand-overview";
import { BuyerOverview } from "@/components/dashboard/buyer-overview";
import { CreatorOverview } from "@/components/dashboard/creator-overview";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getOrderStatsForUser } from "@/lib/dashboard/orders-server";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";
import { db } from "@/lib/db";
import { brandJobPost } from "@/lib/db/schema";

function dashboardOverviewTitle(
  role: "creator" | "buyer" | "brand",
): string {
  if (role === "creator") return "Dashboard pro tvůrce";
  if (role === "buyer") return "Účet nakupujícího";
  return "Panel pro značky";
}

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await requireDashboard();
  return { title: dashboardOverviewTitle(profile.role) };
}

export default async function DashboardOverviewPage() {
  const { profile } = await requireDashboard();
  const orderStats = await getOrderStatsForUser(profile.userId);

  let jobCount = 0;
  if (profile.role === "brand") {
    const [row] = await db
      .select({ total: count() })
      .from(brandJobPost)
      .where(eq(brandJobPost.userId, profile.userId));
    jobCount = row?.total ?? 0;
  }

  const title = dashboardOverviewTitle(profile.role);

  const description =
    profile.role === "creator"
      ? "Přehled objednávek a místo pro budoucí nahrávání hotového obsahu."
      : profile.role === "buyer"
        ? "Sleduj objednávky u tvůrců a stav spolupráce."
        : "Přehled poptávek a objednávek se tvůrci na jednom místě.";

  return (
    <DashboardShell title={title} description={description}>
      {profile.role === "creator" ? (
        <CreatorOverview profile={profile} orderStats={orderStats} />
      ) : profile.role === "buyer" ? (
        <BuyerOverview orderStats={orderStats} />
      ) : (
        <BrandOverview
          profile={profile}
          jobCount={jobCount}
          orderStats={orderStats}
        />
      )}
    </DashboardShell>
  );
}

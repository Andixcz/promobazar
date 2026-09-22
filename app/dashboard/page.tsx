import { redirectToOwnDashboard } from "@/lib/dashboard/require-dashboard";
import type { MemberRole } from "@/lib/db/schema";

type PageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function DashboardIndexPage({ searchParams }: PageProps) {
  const { role } = await searchParams;
  const preferred: MemberRole | undefined =
    role === "creator" || role === "brand" ? role : undefined;
  await redirectToOwnDashboard(preferred);
}

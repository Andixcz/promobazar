import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { requireDashboardProfile } from "@/lib/dashboard/require-dashboard";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function DashboardSlugLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const { session, profile } = await requireDashboardProfile(slug);

  return (
    <DashboardLayout profile={profile} email={session.user.email}>
      {children}
    </DashboardLayout>
  );
}

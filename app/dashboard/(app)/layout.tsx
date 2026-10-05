import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardAppLayout({ children }: LayoutProps) {
  const { session, profile } = await requireDashboard();

  return (
    <DashboardLayout profile={profile} email={session.user.email}>
      {children}
    </DashboardLayout>
  );
}

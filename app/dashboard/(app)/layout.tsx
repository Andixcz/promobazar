import { cookies, headers } from "next/headers";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DASHBOARD_HOME_PATH } from "@/lib/dashboard-routes";
import {
  DASHBOARD_CALLBACK_COOKIE,
  DASHBOARD_CALLBACK_HEADER,
} from "@/lib/dashboard/role-preference";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardAppLayout({ children }: LayoutProps) {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const callbackPath =
    headerStore.get(DASHBOARD_CALLBACK_HEADER) ??
    cookieStore.get(DASHBOARD_CALLBACK_COOKIE)?.value ??
    DASHBOARD_HOME_PATH;
  const { session, profile } = await requireDashboard(callbackPath);

  return (
    <DashboardLayout profile={profile} email={session.user.email}>
      {children}
    </DashboardLayout>
  );
}

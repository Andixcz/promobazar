import type { ReactNode } from "react";

import {
  DashboardMobileNav,
  DashboardSidebar,
} from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";

type DashboardLayoutProps = {
  profile: MemberProfileRow;
  email: string;
  children: ReactNode;
};

export function DashboardLayout({ profile, email, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-void">
      <DashboardSidebar profile={profile} email={email} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-void">
        <DashboardTopbar profile={profile} email={email} />
        <DashboardMobileNav profile={profile} />
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-10 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

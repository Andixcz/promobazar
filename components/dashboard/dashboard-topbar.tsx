import Image from "next/image";
import Link from "next/link";

import { DashboardUserMenu } from "@/components/dashboard/dashboard-user-menu";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { LANDING_FIRMS_PATH } from "@/lib/landing-routes";

type DashboardTopbarProps = {
  profile: MemberProfileRow;
  email: string;
};

export function DashboardTopbar({ profile, email }: DashboardTopbarProps) {
  return (
    <header
      className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] bg-void px-4 md:px-6 lg:hidden"
    >
      <Link
        href={LANDING_FIRMS_PATH}
        className="inline-flex items-center gap-2 lg:hidden"
      >
        <Image
          src="/logo.png"
          alt=""
          width={28}
          height={28}
          className="size-7 rounded-sm object-contain"
        />
        <span className="font-display text-sm font-bold uppercase tracking-tight text-white">
          promobazar
        </span>
      </Link>
      <div className="hidden flex-1 lg:block" aria-hidden />
      <DashboardUserMenu profile={profile} email={email} />
    </header>
  );
}

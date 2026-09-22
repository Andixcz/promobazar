"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings2,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { DashboardUserMenu } from "@/components/dashboard/dashboard-user-menu";
import { dashboardPath } from "@/lib/dashboard-routes";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { LANDING_FIRMS_PATH } from "@/lib/landing-routes";
import { cn } from "@/lib/utils";

type NavItemDef = {
  href: string;
  label: string;
  icon: LucideIcon;
  overview?: boolean;
};

function buildNav(profile: MemberProfileRow): NavItemDef[] {
  const slug = profile.slug;
  const items: NavItemDef[] = [
    { href: dashboardPath(slug), label: "Přehled", icon: LayoutDashboard, overview: true },
  ];
  if (profile.role === "creator") {
    items.push({
      href: dashboardPath(slug, "balicky"),
      label: "Balíčky",
      icon: Package,
    });
  } else {
    items.push({
      href: dashboardPath(slug, "poptavky"),
      label: "Poptávky",
      icon: ClipboardList,
    });
  }
  items.push(
    { href: dashboardPath(slug, "profil"), label: "Profil", icon: UserRound },
    { href: dashboardPath(slug, "nastaveni"), label: "Nastavení", icon: Settings2 },
  );
  return items;
}

function isNavActive(pathname: string | null, href: string, overview?: boolean) {
  if (!pathname) return false;
  if (overview) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  compact,
}: NavItemDef & { active: boolean; compact?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-sm font-medium transition-colors",
        compact ? "shrink-0 px-3 py-2 text-xs" : "px-2.5 py-2 text-[13px]",
        active
          ? "bg-white/[0.08] text-white"
          : "text-mist hover:bg-white/[0.04] hover:text-white",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-[18px] shrink-0 opacity-90" strokeWidth={1.5} aria-hidden />
      {label}
    </Link>
  );
}

function SidebarBrand() {
  return (
    <Link
      href={LANDING_FIRMS_PATH}
      className="inline-flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
    >
      <Image
        src="/logo.png"
        alt=""
        width={28}
        height={28}
        className="size-7 rounded-sm object-contain"
      />
      <span className="font-display text-sm font-bold tracking-tight uppercase">
        promobazar
      </span>
    </Link>
  );
}

export function DashboardSidebar({
  profile,
  email,
}: {
  profile: MemberProfileRow;
  email: string;
}) {
  const pathname = usePathname();
  const items = buildNav(profile);

  return (
    <aside
      className="hidden lg:flex lg:w-[248px] lg:shrink-0 lg:flex-col border-r border-white/[0.08] bg-ink"
    >
      <div className="flex h-14 items-center px-4">
        <SidebarBrand />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2" aria-label="Dashboard">
        <p className="px-2.5 pb-1 pt-2 font-body text-[10px] font-medium uppercase tracking-wider text-mist/90">
          Menu
        </p>
        {items.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={isNavActive(pathname, item.href, item.overview)}
          />
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/[0.08] px-3 py-4">
        <Link
          href={LANDING_FIRMS_PATH}
          className="inline-flex items-center gap-2 px-2.5 text-[13px] font-medium text-mist transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Zpět na web
        </Link>
        <DashboardUserMenu profile={profile} email={email} variant="sidebar" />
      </div>
    </aside>
  );
}

export function DashboardMobileNav({ profile }: { profile: MemberProfileRow }) {
  const pathname = usePathname();
  const items = buildNav(profile);

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-white/[0.08] bg-ink px-3 py-2 lg:hidden"
      aria-label="Dashboard"
    >
      {items.map((item) => (
        <NavItem
          key={item.href}
          {...item}
          compact
          active={isNavActive(pathname, item.href, item.overview)}
        />
      ))}
    </nav>
  );
}

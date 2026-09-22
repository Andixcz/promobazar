"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/dashboard-routes";
import { profileInitials, roleLabel } from "@/lib/dashboard/profile-display";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { LANDING_FIRMS_PATH } from "@/lib/landing-routes";
import { cn } from "@/lib/utils";

type DashboardUserMenuProps = {
  profile: MemberProfileRow;
  email: string;
  variant?: "header" | "sidebar";
};

export function DashboardUserMenu({
  profile,
  email,
  variant = "header",
}: DashboardUserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const initials = profileInitials(profile, email);
  const displayName = profile.displayName?.trim() || roleLabel(profile.role);
  const isSidebar = variant === "sidebar";

  async function onLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className={cn("relative", isSidebar && "w-full")}>
      {isSidebar ? (
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left transition-colors hover:bg-white/[0.04]"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-white/[0.08] text-[10px] font-bold font-display text-white"
            aria-hidden
          >
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">
              {displayName}
            </span>
            <span className="block truncate text-xs text-mist">{email}</span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-mist transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 pr-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span
            className="flex size-7 items-center justify-center rounded-sm bg-white/[0.08] text-[10px] font-bold font-display text-white"
            aria-hidden
          >
            {initials}
          </span>
          <span className="max-w-[140px] truncate hidden sm:inline">{email}</span>
          <ChevronDown
            className={cn("size-3.5 text-mist transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </Button>
      )}

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Zavřít menu"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className={cn(
              "absolute z-50 min-w-[200px] rounded-sm border border-white/[0.12] bg-dd-panel p-1 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)]",
              isSidebar
                ? "bottom-[calc(100%+4px)] left-0 right-0"
                : "right-0 top-[calc(100%+6px)]",
            )}
          >
            <Link
              role="menuitem"
              href={dashboardPath(profile.slug, "profil")}
              className="block rounded-sm px-3 py-2 text-sm text-white/90 hover:bg-white/[0.08]"
              onClick={() => setOpen(false)}
            >
              Profil
            </Link>
            <Link
              role="menuitem"
              href={dashboardPath(profile.slug, "nastaveni")}
              className="block rounded-sm px-3 py-2 text-sm text-white/90 hover:bg-white/[0.08]"
              onClick={() => setOpen(false)}
            >
              Nastavení
            </Link>
            {!isSidebar ? (
              <Link
                role="menuitem"
                href={LANDING_FIRMS_PATH}
                className="block rounded-sm px-3 py-2 text-sm text-white/90 hover:bg-white/[0.08]"
                onClick={() => setOpen(false)}
              >
                Zpět na web
              </Link>
            ) : null}
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-white/90 hover:bg-white/[0.08]"
              onClick={() => {
                setOpen(false);
                void onLogout();
              }}
            >
              <LogOut className="size-4 text-mist" aria-hidden />
              Odhlásit se
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

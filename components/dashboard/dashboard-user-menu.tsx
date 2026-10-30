"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/dashboard-routes";
import { profileInitials, roleLabel } from "@/lib/dashboard/profile-display";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { LANDING_FIRMS_PATH } from "@/lib/landing-routes";
import {
  avatarPlaceholder,
  dropdownOption,
  dropdownPanelNav,
  dropdownPanelNavAbove,
} from "@/lib/ui-surfaces";
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

  const close = () => setOpen(false);

  return (
    <div
      className={cn(
        "dd relative overflow-visible",
        isSidebar && "w-full",
        open && "open z-50",
      )}
    >
      {isSidebar ? (
        <button
          type="button"
          className={cn(
            "dd-trigger flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
            "hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan/35",
            open && "bg-white/[0.06]",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full font-display text-[10px] font-bold",
              avatarPlaceholder,
            )}
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
              "size-4 shrink-0 text-mist transition-transform duration-200",
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
          className="dd-trigger gap-2 pr-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full font-display text-[10px] font-bold",
              avatarPlaceholder,
            )}
            aria-hidden
          >
            {initials}
          </span>
          <span className="max-w-[140px] truncate hidden sm:inline">{email}</span>
          <ChevronDown
            className={cn(
              "size-3.5 text-mist transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </Button>
      )}

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-transparent"
          aria-label="Zavřít menu"
          onClick={close}
        />
      ) : null}

      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          isSidebar ? dropdownPanelNavAbove : dropdownPanelNav,
          open && "open",
        )}
      >
        <Link
          role="menuitem"
          href={dashboardPath("profil")}
          className={cn(dropdownOption, "block")}
          onClick={close}
        >
          Profil
        </Link>
        <Link
          role="menuitem"
          href={dashboardPath("nastaveni")}
          className={cn(dropdownOption, "block")}
          onClick={close}
        >
          Nastavení
        </Link>
        {!isSidebar ? (
          <Link
            role="menuitem"
            href={LANDING_FIRMS_PATH}
            className={cn(dropdownOption, "block")}
            onClick={close}
          >
            Zpět na web
          </Link>
        ) : null}
        <div className="my-0.5 h-px bg-white/[0.08]" role="separator" />
        <button
          type="button"
          role="menuitem"
          className={cn(dropdownOption, "w-full text-left")}
          onClick={() => {
            close();
            void onLogout();
          }}
        >
          Odhlásit se
        </button>
      </div>
    </div>
  );
}

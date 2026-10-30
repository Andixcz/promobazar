"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";
import { UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { AUTH_LOGIN_PATH, AUTH_REGISTER_PATH } from "@/lib/auth-routes";
import { DASHBOARD_HOME_PATH, dashboardPath } from "@/lib/dashboard-routes";
import { isCreatorsLandingPath } from "@/lib/landing-routes";
import { dropdownOption, dropdownPanelNav, mobileHeaderMenuLink, avatarPlaceholder } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

const ddPanelClass = dropdownPanelNav;

const ddOptionClass = dropdownOption;

function useClickOutsideClose(
  rootRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [rootRef, onClose]);
}

type HeaderAccountMenuProps = {
  layout?: "dropdown" | "stack";
};

export function HeaderAccountMenu({ layout = "dropdown" }: HeaderAccountMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const registerHref = isCreatorsLandingPath(pathname)
    ? `${AUTH_REGISTER_PATH}?role=creator`
    : AUTH_REGISTER_PATH;

  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useClickOutsideClose(authMenuRef, () => setAuthMenuOpen(false));
  useClickOutsideClose(userMenuRef, () => setUserMenuOpen(false));

  if (isPending) {
    return layout === "stack" ? (
      <div className="h-20 animate-pulse rounded-md bg-white/[0.04]" />
    ) : (
      <div className="size-9 shrink-0 rounded-full border border-white/10 bg-white/[0.04]" />
    );
  }

  if (!session?.user) {
    if (layout === "stack") {
      return (
        <div className="auth-buttons-group space-y-1 border-t border-white/10 pt-4">
          <Link href={AUTH_LOGIN_PATH} className={mobileHeaderMenuLink}>
            Přihlásit se
          </Link>
          <Link href={registerHref} className={mobileHeaderMenuLink}>
            Registrace
          </Link>
        </div>
      );
    }

    return (
      <div
        ref={authMenuRef}
        className={cn("auth-buttons-group dd relative overflow-visible", authMenuOpen && "open z-[200]")}
        id="auth-menu-dd"
      >
        <Button
          type="button"
          variant="default"
          size="icon"
          aria-label="Účet"
          aria-expanded={authMenuOpen}
          className="dd-trigger shrink-0 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            setAuthMenuOpen((was) => !was);
          }}
        >
          <UserIcon className="size-4 text-void" aria-hidden />
        </Button>
        <div className={cn(ddPanelClass, authMenuOpen && "open")}>
          <Link href={AUTH_LOGIN_PATH} className={cn(ddOptionClass, "block")}>
            Přihlásit se
          </Link>
          <Link href={registerHref} className={cn(ddOptionClass, "block")}>
            Registrace
          </Link>
        </div>
      </div>
    );
  }

  const email = session.user.email;
  const initials = (session.user.name || email).slice(0, 2).toUpperCase();

  async function onLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  if (layout === "stack") {
    return (
      <div className="user-menu-group space-y-1 border-t border-white/10 pt-4">
        <p className="user-menu-email px-3 pb-1 text-xs font-medium text-zinc-200 truncate">
          {email}
        </p>
        <Link href={DASHBOARD_HOME_PATH} className={mobileHeaderMenuLink}>
          Můj dashboard
        </Link>
        <Link href={dashboardPath("nastaveni")} className={mobileHeaderMenuLink}>
          Nastavení účtu
        </Link>
        <button
          type="button"
          className={cn(mobileHeaderMenuLink, "text-left")}
          onClick={() => onLogout()}
        >
          Odhlásit se
        </button>
      </div>
    );
  }

  return (
    <div
      ref={userMenuRef}
      className={cn("dd relative user-menu-group overflow-visible", userMenuOpen && "open z-[200]")}
      id="user-menu-dd"
    >
      <button
        type="button"
        aria-label="Můj účet"
        aria-expanded={userMenuOpen}
        className={cn(
          "user-avatar-initials dd-trigger inline-flex size-9 shrink-0 items-center justify-center rounded-full",
          avatarPlaceholder,
          "font-display text-[10px] font-bold",
          "transition-opacity hover:opacity-90",
          "outline-none focus-visible:ring-3 focus-visible:ring-cyan/35",
        )}
        onClick={(e) => {
          e.stopPropagation();
          setUserMenuOpen((was) => !was);
        }}
      >
        {initials}
      </button>
      <div className={cn(ddPanelClass, userMenuOpen && "open")}>
        <p className="user-menu-email px-4 pt-2 pb-1 text-xs font-medium text-zinc-200 truncate max-w-[200px]">
          {email}
        </p>
        <Link href={DASHBOARD_HOME_PATH} className={cn(ddOptionClass, "block")}>
          Můj dashboard
        </Link>
        <Link
          href={dashboardPath("nastaveni")}
          className={cn(ddOptionClass, "block")}
        >
          Nastavení účtu
        </Link>
        <button
          type="button"
          className={cn(ddOptionClass, "w-full text-left")}
          onClick={() => onLogout()}
        >
          Odhlásit se
        </button>
      </div>
    </div>
  );
}

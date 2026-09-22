"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { invokeAppGlobal } from "@/lib/app-global";
import { authClient } from "@/lib/auth-client";
import { AUTH_LOGIN_PATH, AUTH_REGISTER_PATH } from "@/lib/auth-routes";
import { DASHBOARD_HOME_PATH } from "@/lib/dashboard-routes";
import { cn } from "@/lib/utils";

const ddPanelClass =
  "dd-panel absolute top-[calc(100%+6px)] right-0 z-[100] min-w-[190px] max-h-[280px] overflow-y-auto rounded-sm border border-white/[0.12] bg-dd-panel p-1 space-y-0.5 opacity-0 pointer-events-none -translate-y-1 scale-[0.99] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)] transition-all duration-200 [&.open]:pointer-events-auto [&.open]:translate-y-0 [&.open]:scale-100 [&.open]:opacity-100";

const ddOptionClass =
  "dd-option cursor-pointer rounded-sm px-3 py-2 text-sm leading-snug text-white/90 transition-colors duration-150 hover:bg-white/[0.08] [&.active]:bg-white/[0.12] [&.active]:text-white";

export function HeaderAccountMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="size-9 shrink-0 rounded-full border border-white/10 bg-white/[0.04]" />
    );
  }

  if (!session?.user) {
    return (
      <div
        className="auth-buttons-group dd relative [&.open]:z-[100]"
        id="auth-menu-dd"
      >
        <Button
          type="button"
          variant="default"
          size="icon"
          aria-label="Účet"
          className="dd-trigger shrink-0"
          onClick={(e) =>
            invokeAppGlobal("toggleUserMenu", "auth-menu-dd", e.nativeEvent)
          }
        >
          <UserIcon className="size-4 text-void" aria-hidden />
        </Button>
        <div className={ddPanelClass}>
          <Link href={AUTH_LOGIN_PATH} className={cn(ddOptionClass, "block")}>
            Přihlásit se
          </Link>
          <Link href={AUTH_REGISTER_PATH} className={cn(ddOptionClass, "block")}>
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
    invokeAppGlobal("handleLogout");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="dd relative [&.open]:z-[100] user-menu-group" id="user-menu-dd">
      <button
        type="button"
        aria-label="Můj účet"
        className={cn(
          "user-avatar-initials dd-trigger inline-flex size-9 shrink-0 items-center justify-center rounded-full",
          "bg-gradient-to-br from-violet-500 to-fuchsia-500 font-display text-[10px] font-bold text-white",
          "transition-opacity hover:opacity-90",
          "outline-none focus-visible:ring-3 focus-visible:ring-violet-400/35",
        )}
        onClick={(e) =>
          invokeAppGlobal("toggleUserMenu", "user-menu-dd", e.nativeEvent)
        }
      >
        {initials}
      </button>
      <div className={ddPanelClass}>
        <p className="user-menu-email px-4 pt-2 pb-1 text-xs font-medium text-zinc-200 truncate max-w-[200px]">
          {email}
        </p>
        <Link href={DASHBOARD_HOME_PATH} className={cn(ddOptionClass, "block")}>
          Můj dashboard
        </Link>
        <Link href="/dashboard/nastaveni" className={cn(ddOptionClass, "block")}>
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

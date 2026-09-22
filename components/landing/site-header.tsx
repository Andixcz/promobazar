"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, UserIcon } from "lucide-react";

import { BrandMark } from "@/components/ui/brand-mark";
import { Button } from "@/components/ui/button";
import { invokeAppGlobal } from "@/lib/app-global";
import { goToJobBoardBrowse } from "@/lib/landing-nav";
import {
  isCreatorsLandingPath,
  landingHref,
  LANDING_FIRMS_PATH,
} from "@/lib/landing-routes";
import { audienceSwitcherActive } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

const ddPanelClass =
  "dd-panel absolute top-[calc(100%+6px)] right-0 z-[100] min-w-[190px] max-h-[280px] overflow-y-auto rounded-sm border border-white/[0.12] bg-dd-panel p-1 space-y-0.5 opacity-0 pointer-events-none -translate-y-1 scale-[0.99] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)] transition-all duration-200 [&.open]:pointer-events-auto [&.open]:translate-y-0 [&.open]:scale-100 [&.open]:opacity-100";

const ddOptionClass =
  "dd-option cursor-pointer rounded-sm px-3 py-2 text-sm leading-snug text-white/90 transition-colors duration-150 hover:bg-white/[0.08] [&.active]:bg-white/[0.12] [&.active]:text-white";

/** Stejný vzhled pro odkazy i tlačítka v hlavní navigaci (bez paddingu ghost size). */
const headerNavItemClass =
  "h-auto gap-1.5 p-0 font-medium text-mist hover:bg-transparent hover:text-white";

function NavMoreDropdown({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="dd relative [&.open]:z-[100]" id={id}>
      <Button
        type="button"
        variant="ghost"
        className={cn("dd-trigger inline-flex items-center", headerNavItemClass)}
        onClick={(e) => invokeAppGlobal("toggleUserMenu", id, e.nativeEvent)}
      >
        Více
        <ChevronDownIcon
          className="dd-chevron size-3.5 text-mist transition-transform duration-200 [.open_&]:rotate-180"
          aria-hidden
        />
      </Button>
      <div className={ddPanelClass}>{children}</div>
    </div>
  );
}

function AuthIconTrigger({
  menuId,
  className,
}: {
  menuId: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="default"
      size="icon"
      aria-label="Účet"
      className={cn("dd-trigger shrink-0", className)}
      onClick={(e) => invokeAppGlobal("toggleUserMenu", menuId, e.nativeEvent)}
    >
      <UserIcon className="size-4 text-void" aria-hidden />
    </Button>
  );
}

function AudienceActionButtons({
  firmsId,
  creatorsId,
  isCreators,
  className,
}: {
  firmsId: string;
  creatorsId: string;
  isCreators: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5 shrink-0", className)}>
      <Button
        asChild
        id={firmsId}
        size="sm"
        variant="outline"
        className={cn(
          "px-2.5 text-xs sm:px-4 sm:text-sm",
          audienceSwitcherActive,
          !isCreators && "active",
        )}
      >
        <Link href={landingHref("firms", "marketplace")}>
          <span className="sm:hidden">Promo</span>
          <span className="hidden sm:inline">Najít promo</span>
        </Link>
      </Button>
      <Button
        asChild
        id={creatorsId}
        size="sm"
        variant="outline"
        className={cn(
          "px-2.5 text-xs sm:px-4 sm:text-sm",
          audienceSwitcherActive,
          isCreators && "active",
        )}
      >
        <Link href={landingHref("creators", "propojeni")}>
          <span className="sm:hidden">Tvůrci</span>
          <span className="hidden sm:inline">Pro tvůrce</span>
        </Link>
      </Button>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isCreators = isCreatorsLandingPath(pathname);

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-5 md:px-8 pt-4">
      <div
        className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 overflow-visible rounded-md border border-white/[0.09] bg-panel px-3 py-3 sm:px-4 md:px-6 md:gap-4"
      >
        <Link
          href={isCreators ? landingHref("creators", "top") : LANDING_FIRMS_PATH}
          className="col-start-1 flex items-center gap-2.5 shrink-0"
        >
          <BrandMark />
        </Link>

        <div className="col-start-2 hidden min-w-0 justify-center lg:flex">
          <nav
            id="nav-firms"
            className={cn(
              "flex items-center gap-5 text-sm font-medium text-mist overflow-visible",
              isCreators && "hidden",
            )}
          >
            <Button asChild variant="ghost" className={headerNavItemClass}>
              <a href="#marketplace">Tržiště</a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={headerNavItemClass}
              onClick={() => goToJobBoardBrowse()}
            >
              Poptávky
            </Button>
            <NavMoreDropdown id="nav-more-firms-dd">
              <a href="#cenik" className={cn(ddOptionClass, "block")}>
                Ceník
              </a>
              <a href="#faq" className={cn(ddOptionClass, "block")}>
                FAQ
              </a>
              <a href="#kontakt" className={cn(ddOptionClass, "block")}>
                Kontakt
              </a>
            </NavMoreDropdown>
          </nav>
          <nav
            id="nav-creators"
            className={cn(
              "items-center gap-5 text-sm font-medium text-mist overflow-visible",
              isCreators ? "flex" : "hidden",
            )}
          >
            <Button asChild variant="ghost" className={headerNavItemClass}>
              <a href="#propojeni">Propojení</a>
            </Button>
            <Button asChild variant="ghost" className={headerNavItemClass}>
              <a href="#balicky">Balíčky</a>
            </Button>
            <NavMoreDropdown id="nav-more-creators-dd">
              <a href="#creator-pro" className={cn(ddOptionClass, "block")}>
                Creator PRO
              </a>
              <a href="#faq" className={cn(ddOptionClass, "block")}>
                FAQ
              </a>
              <a href="#kontakt" className={cn(ddOptionClass, "block")}>
                Kontakt
              </a>
            </NavMoreDropdown>
          </nav>
        </div>

        <div className="col-start-3 flex justify-end">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <AudienceActionButtons
              firmsId="switch-firms"
              creatorsId="switch-creators"
              isCreators={isCreators}
            />

            <div
              className="auth-buttons-group dd relative [&.open]:z-[100]"
              id="auth-menu-dd"
            >
              <AuthIconTrigger menuId="auth-menu-dd" />
              <div className={ddPanelClass}>
                <div
                  className={ddOptionClass}
                  onClick={() => invokeAppGlobal("openAuth", "creator")}
                >
                  Přihlásit se
                </div>
                <div
                  className={ddOptionClass}
                  onClick={() => invokeAppGlobal("openAuth", "creator")}
                >
                  Registrace
                </div>
              </div>
            </div>

            <div
              className="dd relative [&.open]:z-[100] user-menu-group hidden"
              id="user-menu-dd"
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Můj účet"
                className="dd-trigger shrink-0 p-0 overflow-hidden"
                onClick={(e) =>
                  invokeAppGlobal("toggleUserMenu", "user-menu-dd", e.nativeEvent)
                }
              >
                <span className="user-avatar-initials flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-display text-[10px] font-bold text-white">
                  ?
                </span>
              </Button>
              <div className={ddPanelClass}>
                <p className="user-menu-email px-4 pt-2 pb-1 text-xs font-medium text-zinc-200 truncate max-w-[200px] empty:hidden" />
                <div
                  className={ddOptionClass}
                  onClick={() => invokeAppGlobal("goToMyDashboard")}
                >
                  Můj dashboard
                </div>
                <div
                  className={ddOptionClass}
                  onClick={() => invokeAppGlobal("openAccountSettings")}
                >
                  Nastavení účtu
                </div>
                <div
                  className={ddOptionClass}
                  onClick={() => invokeAppGlobal("handleLogout")}
                >
                  Odhlásit se
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

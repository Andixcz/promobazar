"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";

import { BrandMark } from "@/components/ui/brand-mark";
import { Button } from "@/components/ui/button";
import { invokeAppGlobal } from "@/lib/app-global";
import { goToJobBoardBrowse } from "@/lib/landing-nav";
import { HeaderAccountMenu } from "@/components/landing/header-account-menu";
import {
  isCreatorsLandingPath,
  landingHref,
  LANDING_FIRMS_PATH,
} from "@/lib/landing-routes";
import {
  audienceSwitcherActive,
  dropdownOption,
  dropdownPanelNav,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

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
      <div className={dropdownPanelNav}>{children}</div>
    </div>
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
              <a href="#cenik" className={cn(dropdownOption, "block")}>
                Ceník
              </a>
              <a href="#faq" className={cn(dropdownOption, "block")}>
                FAQ
              </a>
              <a href="#kontakt" className={cn(dropdownOption, "block")}>
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
              <a href="#creator-pro" className={cn(dropdownOption, "block")}>
                Creator PRO
              </a>
              <a href="#faq" className={cn(dropdownOption, "block")}>
                FAQ
              </a>
              <a href="#kontakt" className={cn(dropdownOption, "block")}>
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

            <HeaderAccountMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

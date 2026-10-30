"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";

import { BrandMark } from "@/components/ui/brand-mark";
import { Button } from "@/components/ui/button";
import { HeaderAccountMenu } from "@/components/shared/header-account-menu";
import {
  isCreatorsLandingPath,
  landingHref,
  LANDING_FIRMS_PATH,
} from "@/lib/landing-routes";
import {
  audienceSwitcherActive,
  dropdownOption,
  dropdownPanelNav,
  mobileHeaderMenuLink,
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (!open) return;
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn("dd relative overflow-visible", open && "open z-[200]")}
      id={id}
    >
      <Button
        type="button"
        variant="ghost"
        className={cn("dd-trigger inline-flex items-center", headerNavItemClass)}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((was) => !was);
        }}
      >
        Více
        <ChevronDownIcon
          className={cn(
            "dd-chevron size-3.5 text-mist transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </Button>
      <div
        className={cn(dropdownPanelNav, open && "open z-[200]")}
        onClick={() => setOpen(false)}
      >
        {children}
      </div>
    </div>
  );
}

function AudienceSegmentSwitch({
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
    <div
      className={cn(
        "relative rounded-lg border border-white/[0.1] bg-white/[0.035] p-1",
        className,
      )}
      role="tablist"
      aria-label="Sekce webu"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1 right-1 rounded-md bg-cyan transition-[top,bottom] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          isCreators
            ? "top-[calc(50%+0.125rem)] bottom-1"
            : "top-1 bottom-[calc(50%+0.125rem)]",
        )}
      />
      <div className="relative flex flex-col gap-1">
        <Link
          id={firmsId}
          href={landingHref("firms", "marketplace")}
          role="tab"
          aria-selected={!isCreators}
          className={cn(
            "relative z-10 rounded-md px-3 py-3 text-center text-sm font-semibold transition-colors duration-200",
            !isCreators ? "text-void" : "text-white/70 hover:text-white",
          )}
        >
          Najít promo
        </Link>
        <Link
          id={creatorsId}
          href={landingHref("creators", "jak-to-funguje")}
          role="tab"
          aria-selected={isCreators}
          className={cn(
            "relative z-10 rounded-md px-3 py-3 text-center text-sm font-semibold transition-colors duration-200",
            isCreators ? "text-void" : "text-white/70 hover:text-white",
          )}
        >
          Pro tvůrce
        </Link>
      </div>
    </div>
  );
}

function AudienceActionButtons({
  firmsId,
  creatorsId,
  isCreators,
  className,
  stacked = false,
}: {
  firmsId: string;
  creatorsId: string;
  isCreators: boolean;
  className?: string;
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <AudienceSegmentSwitch
        firmsId={firmsId}
        creatorsId={creatorsId}
        isCreators={isCreators}
        className={className}
      />
    );
  }

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
        <Link href={landingHref("creators", "jak-to-funguje")}>
          <span className="sm:hidden">Tvůrci</span>
          <span className="hidden sm:inline">Pro tvůrce</span>
        </Link>
      </Button>
    </div>
  );
}

function FirmsNav({
  variant,
  onNavigate,
}: {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const close = onNavigate;

  if (variant === "mobile") {
    return (
      <nav className="space-y-1" aria-label="Pro značky">
        <Link
          href="#marketplace"
          className={mobileHeaderMenuLink}
          onClick={close}
        >
          Tržiště
        </Link>
        <Link href="#cenik" className={mobileHeaderMenuLink} onClick={close}>
          Ceník
        </Link>
        <Link href="#faq" className={mobileHeaderMenuLink} onClick={close}>
          FAQ
        </Link>
        <Link href="#kontakt" className={mobileHeaderMenuLink} onClick={close}>
          Kontakt
        </Link>
      </nav>
    );
  }

  return (
    <nav
      id="nav-firms"
      className="flex items-center gap-5 text-sm font-medium text-mist overflow-visible"
    >
      <Button asChild variant="ghost" className={headerNavItemClass}>
        <a href="#marketplace">Tržiště</a>
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
  );
}

function CreatorsNav({
  variant,
  onNavigate,
}: {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const close = onNavigate;

  if (variant === "mobile") {
    return (
      <nav className="space-y-1" aria-label="Pro tvůrce">
        <Link href="#jak-to-funguje" className={mobileHeaderMenuLink} onClick={close}>
          Jak to funguje
        </Link>
        <Link href="#balicky" className={mobileHeaderMenuLink} onClick={close}>
          Balíčky
        </Link>
        <Link href="#creator-pro" className={mobileHeaderMenuLink} onClick={close}>
          Plány
        </Link>
        <Link href="#faq" className={mobileHeaderMenuLink} onClick={close}>
          FAQ
        </Link>
        <Link href="#kontakt" className={mobileHeaderMenuLink} onClick={close}>
          Kontakt
        </Link>
      </nav>
    );
  }

  return (
    <nav
      id="nav-creators"
      className="flex items-center gap-5 text-sm font-medium text-mist overflow-visible"
    >
      <Button asChild variant="ghost" className={headerNavItemClass}>
        <a href="#jak-to-funguje">Jak to funguje</a>
      </Button>
      <Button asChild variant="ghost" className={headerNavItemClass}>
        <a href="#balicky">Balíčky</a>
      </Button>
      <NavMoreDropdown id="nav-more-creators-dd">
        <a href="#propojeni" className={cn(dropdownOption, "block")}>
          Profil v tržišti
        </a>
        <a href="#creator-pro" className={cn(dropdownOption, "block")}>
          Plány a Creator PRO
        </a>
        <a href="#faq" className={cn(dropdownOption, "block")}>
          FAQ
        </a>
        <a href="#kontakt" className={cn(dropdownOption, "block")}>
          Kontakt
        </a>
      </NavMoreDropdown>
    </nav>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isCreators = isCreatorsLandingPath(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/45 backdrop-blur-[1px] transition-opacity duration-300 ease-out lg:hidden motion-reduce:transition-none"
          aria-label="Zavřít menu"
          onClick={closeMobile}
        />
      ) : null}

      <header className="fixed top-0 inset-x-0 z-40 px-5 md:px-8 pt-4">
        <div className="relative mx-auto max-w-7xl overflow-visible rounded-md border border-white/[0.09] bg-panel">
        <div className="grid max-w-7xl grid-cols-[1fr_auto] items-center gap-3 overflow-visible px-3 py-3 sm:px-4 lg:grid-cols-[auto_1fr_auto] md:px-6 md:gap-4">
          <Link
            href={
              isCreators ? landingHref("creators", "top") : LANDING_FIRMS_PATH
            }
            className="col-start-1 flex min-w-0 items-center gap-2.5 shrink-0"
          >
            <BrandMark />
          </Link>

          <div className="col-start-2 hidden min-w-0 justify-center lg:flex">
            {isCreators ? (
              <CreatorsNav variant="desktop" />
            ) : (
              <FirmsNav variant="desktop" />
            )}
          </div>

          <div className="col-start-2 flex justify-end lg:col-start-3">
            <div className="hidden items-center gap-1.5 sm:gap-2 lg:flex">
              <AudienceActionButtons
                firmsId="switch-firms"
                creatorsId="switch-creators"
                isCreators={isCreators}
              />
              <HeaderAccountMenu />
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden shrink-0"
              aria-expanded={mobileOpen}
              aria-controls="site-mobile-nav"
              aria-label={mobileOpen ? "Zavřít menu" : "Otevřít menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <XIcon className="size-5" aria-hidden />
              ) : (
                <MenuIcon className="size-5" aria-hidden />
              )}
            </Button>
          </div>
        </div>

        <div
          id="site-mobile-nav"
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:hidden",
            mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
          aria-hidden={!mobileOpen}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={cn(
                "border-t border-white/10 px-3 pb-4 pt-4 sm:px-4 md:px-6 transition-opacity duration-300 motion-reduce:transition-none",
                mobileOpen ? "opacity-100" : "opacity-0",
              )}
            >
              <AudienceActionButtons
                firmsId="switch-firms-mobile"
                creatorsId="switch-creators-mobile"
                isCreators={isCreators}
                stacked
                className="mb-5"
              />

              {isCreators ? (
                <CreatorsNav variant="mobile" onNavigate={closeMobile} />
              ) : (
                <FirmsNav variant="mobile" onNavigate={closeMobile} />
              )}

              <HeaderAccountMenu layout="stack" />
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}

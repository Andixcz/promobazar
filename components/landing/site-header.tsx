"use client";

import { legacyInvoke } from "@/lib/legacy-bridge";
import { BrandMark } from "@/components/ui/brand-mark";

export function SiteHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="max-w-7xl mx-auto px-5 md:px-8 mt-4">
        <div className="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-2xl px-5 md:px-6 py-3.5 flex items-center justify-between gap-3">
          <a
            href="#top"
            className="flex items-center gap-2.5 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              legacyInvoke("switchView", "firms");
            }}
          >
            <BrandMark />
          </a>

          <nav
            id="nav-firms"
            className="hidden xl:flex items-center gap-6 text-sm text-mist font-medium"
          >
            <a href="#marketplace" className="hover:text-white transition">
              Tržiště
            </a>
            <button
              type="button"
              onClick={() => legacyInvoke("goToJobBoardBrowse")}
              className="hover:text-white transition"
            >
              Poptávky
            </button>
            <a href="#cenik" className="hover:text-white transition">
              Ceník
            </a>
            <a href="#faq" className="hover:text-white transition">
              FAQ
            </a>
          </nav>
          <nav
            id="nav-creators"
            className="hidden xl:flex items-center gap-6 text-sm text-mist font-medium"
          >
            <a href="#propojeni" className="hover:text-white transition">
              Propojení
            </a>
            <a href="#balicky" className="hover:text-white transition">
              Balíčky
            </a>
            <a href="#creator-pro" className="hover:text-white transition">
              Creator PRO
            </a>
            <a href="#kontakt" className="hover:text-white transition">
              Kontakt
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="auth-buttons-group flex items-center gap-2">
              <button
                type="button"
                onClick={() => legacyInvoke("openAuth", "creator")}
                className="hidden md:inline-block text-sm font-semibold text-white/80 hover:text-white transition whitespace-nowrap"
              >
                Přihlásit se
              </button>
              <button
                type="button"
                onClick={() => legacyInvoke("openAuth", "creator")}
                className="hidden sm:inline-block bg-white/[0.04] border border-white/[0.14] transition-all duration-300 hover:bg-white/[0.09] hover:border-white/[0.24] text-sm font-semibold px-4 py-2.5 rounded-xl text-white whitespace-nowrap"
              >
                Registrace
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-full p-1">
              <button
                type="button"
                id="switch-firms"
                onClick={() => legacyInvoke("switchView", "firms")}
                className="switcher-pill rounded-full transition-all duration-300 [&.active]:bg-gradient-to-r [&.active]:from-violet [&.active]:via-magenta [&.active]:to-cyan [&.active]:text-white [&.active]:shadow-[0_6px_24px_-6px_rgba(160,60,255,0.6)] active text-xs font-semibold px-3.5 py-1.5 rounded-full"
              >
                Chci promo
              </button>
              <button
                type="button"
                id="switch-creators"
                onClick={() => legacyInvoke("switchView", "creators")}
                className="switcher-pill rounded-full transition-all duration-300 [&.active]:bg-gradient-to-r [&.active]:from-violet [&.active]:via-magenta [&.active]:to-cyan [&.active]:text-white [&.active]:shadow-[0_6px_24px_-6px_rgba(160,60,255,0.6)] text-xs font-semibold px-3.5 py-1.5 rounded-full text-mist"
              >
                Pro tvůrce
              </button>
            </div>
            <button
              type="button"
              id="nav-cta-firms"
              onClick={() => {
                legacyInvoke("switchView", "firms");
                legacyInvoke("scrollToId", "marketplace");
              }}
              className="bg-gradient-to-r from-violet via-magenta to-cyan text-white shadow-[0_8px_30px_-6px_rgba(160,60,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-4px_rgba(232,56,255,0.65)] hover:brightness-105 active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none text-sm font-semibold px-4 md:px-5 py-2.5 rounded-xl text-white whitespace-nowrap"
            >
              Najít promo
            </button>
            <button
              type="button"
              id="nav-cta-creators"
              onClick={() => {
                legacyInvoke("switchView", "creators");
                legacyInvoke("scrollToId", "propojeni");
              }}
              className="bg-gradient-to-r from-violet via-magenta to-cyan text-white shadow-[0_8px_30px_-6px_rgba(160,60,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-4px_rgba(232,56,255,0.65)] hover:brightness-105 active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none text-sm font-semibold px-4 md:px-5 py-2.5 rounded-xl text-white whitespace-nowrap hidden"
            >
              Propojit profil
            </button>

            <div className="dd relative [&.open]:z-[100] user-menu-group hidden" id="user-menu-dd">
              <button
                type="button"
                className="dd-trigger flex w-full cursor-pointer items-center justify-between gap-2 text-left bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-full pl-1.5 pr-3 py-1.5 flex items-center gap-2"
                onClick={(e) =>
                  legacyInvoke("toggleUserMenu", "user-menu-dd", e.nativeEvent)
                }
              >
                <span className="user-avatar-initials w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-display font-bold text-white text-[10px]">
                  ?
                </span>
                <span className="user-menu-email hidden md:inline text-xs font-medium max-w-[120px] truncate" />
                <span className="dd-chevron text-xs text-mist transition-transform duration-200 [.open_&]:rotate-180 text-mist">▾</span>
              </button>
              <div
                className="dd-panel absolute top-[calc(100%+10px)] left-0 right-0 z-[100] max-h-[280px] overflow-y-auto rounded-2xl border border-white/[0.14] bg-dd-panel p-2 opacity-0 pointer-events-none -translate-y-2 scale-[0.98] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.65)] transition-all duration-200 [&.open]:pointer-events-auto [&.open]:translate-y-0 [&.open]:scale-100 [&.open]:opacity-100"
                style={{ left: "auto", right: 0, minWidth: 190 }}
              >
                <div
                  className="dd-option cursor-pointer rounded-[0.7rem] px-4 py-3 text-sm leading-snug transition-colors duration-150 hover:bg-white/[0.09] [&.active]:bg-magenta/[0.16] [&.active]:text-white"
                  onClick={() => legacyInvoke("goToMyDashboard")}
                >
                  Můj dashboard
                </div>
                <div
                  className="dd-option cursor-pointer rounded-[0.7rem] px-4 py-3 text-sm leading-snug transition-colors duration-150 hover:bg-white/[0.09] [&.active]:bg-magenta/[0.16] [&.active]:text-white"
                  onClick={() => legacyInvoke("openAccountSettings")}
                >
                  Nastavení účtu
                </div>
                <div
                  className="dd-option cursor-pointer rounded-[0.7rem] px-4 py-3 text-sm leading-snug transition-colors duration-150 hover:bg-white/[0.09] [&.active]:bg-magenta/[0.16] [&.active]:text-white"
                  onClick={() => legacyInvoke("handleLogout")}
                >
                  Odhlásit se
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:hidden flex justify-center items-center gap-2 mt-3">
          <div className="flex items-center gap-1 bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-full p-1">
            <button
              type="button"
              onClick={() => legacyInvoke("switchView", "firms")}
              id="switch-firms-m"
              className="switcher-pill rounded-full transition-all duration-300 [&.active]:bg-gradient-to-r [&.active]:from-violet [&.active]:via-magenta [&.active]:to-cyan [&.active]:text-white [&.active]:shadow-[0_6px_24px_-6px_rgba(160,60,255,0.6)] active text-xs font-semibold px-4 py-1.5 rounded-full"
            >
              Chci promo
            </button>
            <button
              type="button"
              onClick={() => legacyInvoke("switchView", "creators")}
              id="switch-creators-m"
              className="switcher-pill text-xs font-semibold px-4 py-1.5 rounded-full text-mist"
            >
              Pro tvůrce
            </button>
          </div>
          <button
            type="button"
            onClick={() => legacyInvoke("openAuth", "creator")}
            className="auth-buttons-group bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-xs font-semibold px-3.5 py-2 rounded-full text-white/85"
          >
            Účet
          </button>

          <div className="dd relative [&.open]:z-[100] user-menu-group hidden" id="user-menu-dd-mobile">
            <button
              type="button"
              className="dd-trigger flex w-full cursor-pointer items-center justify-between gap-2 text-left bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-full pl-1.5 pr-3 py-1.5 flex items-center gap-2"
              onClick={(e) =>
                legacyInvoke(
                  "toggleUserMenu",
                  "user-menu-dd-mobile",
                  e.nativeEvent,
                )
              }
            >
              <span className="user-avatar-initials w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-display font-bold text-white text-[9px]">
                ?
              </span>
              <span className="dd-chevron text-xs text-mist transition-transform duration-200 [.open_&]:rotate-180 text-mist">▾</span>
            </button>
            <div
              className="dd-panel absolute top-[calc(100%+10px)] left-0 right-0 z-[100] max-h-[280px] overflow-y-auto rounded-2xl border border-white/[0.14] bg-dd-panel p-2 opacity-0 pointer-events-none -translate-y-2 scale-[0.98] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.65)] transition-all duration-200 [&.open]:pointer-events-auto [&.open]:translate-y-0 [&.open]:scale-100 [&.open]:opacity-100"
              style={{ left: "auto", right: 0, minWidth: 180 }}
            >
              <div
                className="dd-option cursor-pointer rounded-[0.7rem] px-4 py-3 text-sm leading-snug transition-colors duration-150 hover:bg-white/[0.09] [&.active]:bg-magenta/[0.16] [&.active]:text-white"
                onClick={() => legacyInvoke("goToMyDashboard")}
              >
                Můj dashboard
              </div>
              <div
                className="dd-option cursor-pointer rounded-[0.7rem] px-4 py-3 text-sm leading-snug transition-colors duration-150 hover:bg-white/[0.09] [&.active]:bg-magenta/[0.16] [&.active]:text-white"
                onClick={() => legacyInvoke("openAccountSettings")}
              >
                Nastavení účtu
              </div>
              <div
                className="dd-option cursor-pointer rounded-[0.7rem] px-4 py-3 text-sm leading-snug transition-colors duration-150 hover:bg-white/[0.09] [&.active]:bg-magenta/[0.16] [&.active]:text-white"
                onClick={() => legacyInvoke("handleLogout")}
              >
                Odhlásit se
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

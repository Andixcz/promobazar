"use client";

import { legacyInvoke } from "@/lib/legacy-bridge";

export function SiteFooter() {
  return (
    <footer className="px-5 md:px-8 pb-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-mist border-t border-white/10 pt-8">
        <span className="font-display font-semibold text-white">
          promobazar<span className="bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent">.cz</span>
        </span>
        <span>© 2026 promobazar.cz — tržiště influencer marketingu</span>
        <div className="flex gap-5">
          <span
            className="text-white/40 cursor-default select-none"
            title="Chystáme se, děkujeme za trpělivost"
          >
            Obchodní podmínky (připravujeme)
          </span>
          <a href="#" className="hover:text-white transition">
            Ochrana údajů
          </a>
          <button
            type="button"
            onClick={() => legacyInvoke("scrollToId", "kontakt")}
            className="hover:text-white transition"
          >
            Kontakt
          </button>
        </div>
      </div>
    </footer>
  );
}

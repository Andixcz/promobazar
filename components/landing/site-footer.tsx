"use client";

import { Button } from "@/components/ui/button";
import { legacyInvoke } from "@/lib/legacy-bridge";

export function SiteFooter() {
  return (
    <footer className="pb-section-x pb-32 pt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-200 border-t border-white/10 pt-8">
        <span className="font-display font-semibold text-white">
          promobazar<span className="bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent">.cz</span>
        </span>
        <span>© 2026 promobazar.cz — tržiště influencer marketingu</span>
        <div className="flex gap-5 items-center">
          <span
            className="text-white/40 cursor-default select-none"
            title="Chystáme se, děkujeme za trpělivost"
          >
            Obchodní podmínky (připravujeme)
          </span>
          <a href="#" className="hover:text-white transition">
            Ochrana údajů
          </a>
          <Button
            type="button"
            variant="ghost"
            onClick={() => legacyInvoke("scrollToId", "kontakt")}
          >
            Kontakt
          </Button>
        </div>
      </div>
    </footer>
  );
}

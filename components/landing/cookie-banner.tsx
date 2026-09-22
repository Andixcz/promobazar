"use client";

import { legacyInvoke } from "@/lib/legacy-bridge";

export function CookieBanner() {
  return (
    <div id="cookie-banner" className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.12] backdrop-blur-[14px] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-4">
        <p className="text-sm text-mist flex-1">
          🍪 Tento web používá cookies ke zlepšení zážitku a analýze návštěvnosti.
          Obchodní podmínky připravujeme.
        </p>
        <div className="flex flex-wrap gap-2 shrink-0 justify-center">
          <button
            type="button"
            onClick={() => legacyInvoke("cookieChoice", "essential")}
            className="bg-white/[0.04] border border-white/[0.14] transition-all duration-300 hover:bg-white/[0.09] hover:border-white/[0.24] text-xs font-semibold px-4 py-2.5 rounded-lg text-white/85"
          >
            Jen nezbytné
          </button>
          <button
            type="button"
            onClick={() => legacyInvoke("openCookieSettings")}
            className="bg-white/[0.04] border border-white/[0.14] transition-all duration-300 hover:bg-white/[0.09] hover:border-white/[0.24] text-xs font-semibold px-4 py-2.5 rounded-lg text-white/85"
          >
            Nastavení
          </button>
          <button
            type="button"
            onClick={() => legacyInvoke("cookieChoice", "all")}
            className="bg-gradient-to-r from-violet via-magenta to-cyan text-white shadow-[0_8px_30px_-6px_rgba(160,60,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-4px_rgba(232,56,255,0.65)] hover:brightness-105 active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none text-xs font-semibold px-5 py-2.5 rounded-lg text-white"
          >
            Přijmout vše
          </button>
        </div>
      </div>
    </div>
  );
}

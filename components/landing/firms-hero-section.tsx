"use client";

import { legacyInvoke } from "@/lib/legacy-bridge";

/** Hero + vyhledávací shell pro značky. Mount pointy dropdownů musí zůstat pro legacy-app.js. */
export function FirmsHeroSection() {
  return (
    <section id="top" className="relative pt-40 sm:pt-32 pb-16 px-5 md:px-8">
      <div className="max-w-6xl mx-auto text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-full px-4 py-1.5 text-xs font-mono text-[11px] tracking-wide text-mist mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_#6366f1]" />
          TRŽIŠTĚ PROMOBAZAR.CZ · INFLUENCEŘI A UGC TVŮRCI
        </div>
        <h1 className="font-display font-extrabold leading-[1.05] text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[4.2rem] tracking-tight">
          Vyber si influencera.
          <br />
          Nastav rozpočet.
          <br />
          <span className="bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent">Získej prodeje.</span>
        </h1>
        <p className="mt-6 text-mist text-base md:text-lg max-w-2xl mx-auto">
          Tržiště influencerů a UGC tvůrců. Vyber si promo, nastav rozpočet, získej
          prodeje — stejně snadno, jako si vybíráš dovolenou.
        </p>
      </div>

      <div
        className="max-w-5xl mx-auto mt-11 animate-fade-up"
        style={{ animationDelay: ".1s" }}
      >
        <div className="relative rounded-[26px] p-2 bg-gradient-to-br from-brand-indigo to-brand-purple shadow-[0_35px_110px_-14px_rgba(99,102,241,0.7)] ring-1 ring-brand-purple/45">
          <div className="rounded-[20px] bg-void shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] bg-[radial-gradient(140%_160%_at_25%_0%,rgba(99,102,241,0.14),transparent_55%)] p-2.5 md:p-3">
            <div className="flex flex-col lg:flex-row items-stretch">
              <div className="flex-1 px-5 py-3.5 lg:py-3 relative">
                <label className="block text-[11px] font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">
                  Kde chceš promo?
                </label>
                <div id="dd-platform-mount" />
              </div>
              <div className="bg-white/[0.09] w-full h-px lg:w-px lg:h-auto" />
              <div className="flex-1 px-5 py-3.5 lg:py-3 relative">
                <label className="block text-[11px] font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">
                  Kdo má promo dělat?
                </label>
                <div id="dd-category-mount" />
              </div>
              <div className="bg-white/[0.09] w-full h-px lg:w-px lg:h-auto" />
              <div className="flex-1 px-5 py-3.5 lg:py-3 relative">
                <label className="block text-[11px] font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">
                  Délka licence na reklamu
                </label>
                <div id="dd-license-mount" />
              </div>
            </div>
            <div className="bg-white/[0.09] w-full h-px" />
            <div className="flex flex-col lg:flex-row items-stretch">
              <div className="flex-[1.6] px-5 py-3.5 lg:py-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] tag uppercase text-mist">
                    Rozpočet do
                  </label>
                  <span
                    id="f-budget-label"
                    className="font-mono text-[11px] tracking-wide font-semibold"
                    style={{ color: "#a5b4fc" }}
                  >
                    15 000 Kč
                  </span>
                </div>
                <input
                  id="f-budget"
                  type="range"
                  min={1000}
                  max={30000}
                  step={500}
                  defaultValue={15000}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-brand-indigo to-brand-purple [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-purple [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(99,102,241,0.35),0_0_18px_rgba(139,92,246,0.6)] w-full mt-2.5"
                />
              </div>
              <div className="p-2 lg:p-2 flex flex-col items-stretch gap-1.5 lg:ml-auto">
                <button
                  type="button"
                  id="search-btn"
                  className="bg-gradient-to-r from-violet via-magenta to-cyan text-white shadow-[0_8px_30px_-6px_rgba(160,60,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-4px_rgba(232,56,255,0.65)] hover:brightness-105 active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none w-full lg:w-auto font-display font-semibold text-sm md:text-[15px] px-7 py-4 rounded-2xl text-white whitespace-nowrap"
                >
                  Vyhledat promo
                </button>
                <button
                  type="button"
                  onClick={() => legacyInvoke("openConcierge")}
                  className="text-[11px] hover:text-white underline text-center whitespace-nowrap transition"
                  style={{ color: "#a5b4fc" }}
                >
                  Nechce se ti vybírat? Nech výběr na nás →
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-mist mt-4 font-mono text-[11px] tracking-wide">
          Bezpečná platba — peníze držíme v úschově do schválení videa
        </p>
      </div>
    </section>
  );
}

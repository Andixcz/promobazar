"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { invokeAppGlobal } from "@/lib/app-global";
import { sectionX } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

function syncBudgetRangeFill(el: HTMLInputElement) {
  const min = Number(el.min);
  const max = Number(el.max);
  const val = Number(el.value);
  el.style.setProperty(
    "--range-fill",
    `${((val - min) / (max - min)) * 100}%`,
  );
}

/** Hero + vyhledávací shell pro značky. Mount pointy dropdownů musí zůstat pro app.js. */
export function FirmsHeroSection() {
  const budgetRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (budgetRef.current) syncBudgetRangeFill(budgetRef.current);
  }, []);

  return (
    <section
      id="top"
      className={cn("relative pt-40 sm:pt-32 py-8", sectionX)}
    >
      <div className="max-w-7xl mx-auto text-center animate-fade-up">
        <h1 className="font-display font-extrabold leading-[1.05] text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[4.2rem] tracking-tight">
          Vyber si influencera.
          <br />
          Nastav rozpočet.
          <br />
          <span className="text-cyan">Získej prodeje.</span>
        </h1>
        <p className="mt-6 text-base text-zinc-200 md:text-lg max-w-2xl mx-auto">
          Víš, že potřebuješ promo, ale ne vždy víš, komu napsat a jestli tomu můžeš
          věřit. Tady porovnáš tvůrce na jednom místě a oslovíš jen toho, kdo ti sedí.
        </p>
      </div>

      <div
        className="max-w-7xl mx-auto mt-11 animate-fade-up"
        style={{ animationDelay: ".1s" }}
      >
        <div className="relative rounded-md border border-white/[0.09] bg-panel p-2.5 md:p-3">
            <div className="flex flex-col lg:flex-row items-stretch">
              <div className="flex-1 px-5 py-3.5 lg:py-3 relative">
                <Label>Kde chceš promo?</Label>
                <div id="dd-platform-mount" />
              </div>
              <div className="bg-white/[0.09] w-full h-px lg:w-px lg:h-auto" />
              <div className="flex-1 px-5 py-3.5 lg:py-3 relative">
                <Label>Kdo má promo dělat?</Label>
                <div id="dd-category-mount" />
              </div>
              <div className="bg-white/[0.09] w-full h-px lg:w-px lg:h-auto" />
              <div className="flex-1 px-5 py-3.5 lg:py-3 relative">
                <Label>Délka licence na reklamu</Label>
                <div id="dd-license-mount" />
              </div>
            </div>
            <div className="bg-white/[0.09] w-full h-px" />
            <div className="flex flex-col gap-4 px-4 py-3.5 md:px-5 lg:flex-row lg:items-end lg:gap-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <Label className="mb-0">Rozpočet do</Label>
                  <span
                    id="f-budget-label"
                    className="font-body text-xs font-semibold tabular-nums tracking-wide text-cyan"
                  >
                    15 000 Kč
                  </span>
                </div>
                <input
                  ref={budgetRef}
                  id="f-budget"
                  type="range"
                  min={1000}
                  max={30000}
                  step={500}
                  defaultValue={15000}
                  className="pb-range"
                  onInput={(e) => syncBudgetRangeFill(e.currentTarget)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-auto w-full justify-start px-0 py-0 text-left text-[11px] font-normal text-mist hover:bg-transparent hover:text-white lg:w-auto"
                  onClick={() => invokeAppGlobal("openConcierge")}
                >
                  Nechce se ti vybírat? Nech výběr na nás →
                </Button>
              </div>
              <Button
                type="button"
                id="search-btn"
                size="lg"
                className="w-full shrink-0 lg:w-[11.5rem]"
              >
                Vyhledat promo
              </Button>
            </div>
        </div>
      </div>
    </section>
  );
}

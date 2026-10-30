"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, Mail, Star, Tag } from "lucide-react";
import { useEffect, useState } from "react";

import { FaqSection } from "@/components/pages/faq-section";
import { FirmsMarketplace } from "@/components/pages/firms/marketplace";
import { AUTH_REGISTER_PATH } from "@/lib/auth-routes";
import { landingHref } from "@/lib/landing-routes";
import {
  eyebrow,
  htmlButtonCta,
  htmlButtonOutline,
  pricingIcon,
  pricingListCheckBox,
  section,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type BrandPlanId = "starter" | "growth";
const BRAND_PLAN_STORAGE_KEY = "pb_brand_plan";
const activePlanButtonClass =
  "mt-8 flex w-full cursor-default items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] py-3.5 text-sm font-semibold text-mist";

function readBrandPlan(): BrandPlanId {
  if (typeof window === "undefined") return "starter";
  return localStorage.getItem(BRAND_PLAN_STORAGE_KEY) === "growth"
    ? "growth"
    : "starter";
}

function BrandPlanCta({ plan }: { plan: BrandPlanId }) {
  const [currentPlan, setCurrentPlan] = useState<BrandPlanId>("starter");

  useEffect(() => {
    setCurrentPlan(readBrandPlan());
    const sync = () => setCurrentPlan(readBrandPlan());
    window.addEventListener("pb-brand-plan-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pb-brand-plan-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (currentPlan === plan) {
    return (
      <button type="button" disabled className={activePlanButtonClass}>
        <Check className="size-4 shrink-0" aria-hidden />
        Aktivní plán
      </button>
    );
  }
  if (plan === "starter") {
    return <div className="mt-8 h-12" aria-hidden />;
  }
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.setItem(BRAND_PLAN_STORAGE_KEY, "growth");
        window.dispatchEvent(new Event("pb-brand-plan-change"));
        setCurrentPlan("growth");
      }}
      className={`${htmlButtonCta} w-full mt-8`}
    >
      Vybrat Growth
    </button>
  );
}

function PricingCheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className={pricingListCheckBox} aria-hidden>
        <Check strokeWidth={2.5} />
      </span>
      {children}
    </li>
  );
}

/** Obsah homepage `/` — tržiště, ceník, FAQ. */
export function FirmsPage() {
  return (
    <main id="view-firms">
      <FirmsMarketplace />
      <section id="jak-to-funguje" className="relative px-5 py-16 md:px-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
            Jak to funguje pro značky
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-200">
            Tři kroky mezi tvým produktem a hotovým promo videem na síti.
          </p>
          <div className="mt-14 grid gap-2 md:grid-cols-3">
            <div className="relative rounded-2xl border border-white/[0.05] bg-panel p-7">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-cyan font-display text-xl font-bold text-void">
                1
              </div>
              <h3 className="font-display text-lg font-semibold">Vybereš influencera</h3>
              <p className="text-sm leading-relaxed text-zinc-200">
                Podle ceny, platformy a oboru najdeš přesně toho tvůrce, jehož publikum kupuje
                produkty jako ten tvůj.
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/[0.05] bg-panel p-7">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-cyan font-display text-xl font-bold text-void">
                2
              </div>
              <h3 className="font-display text-lg font-semibold">Zadáš a zaplatíš</h3>
              <p className="text-sm leading-relaxed text-zinc-200">
                Napíšeš zadání a zaplatíš celou částku. Tvůrce má 48 hodin na přijetí.
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/[0.05] bg-panel p-7">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-cyan font-display text-xl font-bold text-void">
                3
              </div>
              <h3 className="font-display text-lg font-semibold">Schválíš výstup</h3>
              <p className="text-sm leading-relaxed text-zinc-200">
                Máš 3 dny na schválení nebo jednu úpravu.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-2xl border border-white/[0.05] bg-panel p-8 md:flex-row md:p-10">
          <div>
            <span className="font-body text-[11px] font-medium uppercase tracking-wide text-cyan">
              Jsi influencer nebo UGC tvůrce?
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">
              Nabídni spolupráci značkám s jasnou cenou a pravidly
            </h3>
            <p className="mt-2 max-w-lg text-zinc-200">
              Založ profil v tržišti, nastav balíčky a přijímej placené objednávky. Platba jde do
              úschovy a komunikace probíhá na platformě.
            </p>
          </div>
          <Link href={landingHref("creators", "jak-to-funguje")} className={htmlButtonCta}>
            Pro tvůrce: jak to funguje
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </section>

      <section id="cenik" className="px-5 py-16 md:px-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
            Ceníkové balíčky pro značky
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-200">
            Platíš jen za kampaně, které skutečně proběhnou. Peníze držíme do schválení výstupu.
          </p>
          <div className="mt-6 w-full">
            <div
              className="flex w-full items-start gap-3 rounded-md border border-cyan/20 bg-cyan/[0.05] px-4 py-3 text-left md:items-center"
              role="note"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-cyan/15 text-cyan"
                aria-hidden
              >
                <Tag className="size-4" />
              </span>
              <p className="text-sm leading-relaxed text-zinc-200">
                <span className="font-medium text-white">
                  Tvé video může fungovat i v placené reklamě.
                </span>
                <span className="text-mist">
                  {" "}
                  Licence pro Meta a TikTok Ads je v ceně balíčku na 30 až 90 dní.
                </span>
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-2 pt-3 md:grid-cols-3 md:items-stretch">
            <div className="relative rounded-2xl border border-white/[0.05] bg-panel p-8">
              <h3 className="font-display text-xl font-semibold">Starter</h3>
              <p className="mt-1.5 text-sm text-zinc-200">Pro první test influencer marketingu</p>
              <p className="mt-7 font-display text-4xl font-extrabold">
                0 Kč <span className="text-sm font-normal text-mist">/ měsíc</span>
              </p>
              <div className="my-6 h-px bg-white/10" />
              <ul className="space-y-3.5 text-sm text-zinc-200">
                <PricingCheckItem>Neomezené procházení tržiště</PricingCheckItem>
                <PricingCheckItem>Objednávka u 1 tvůrce naráz</PricingCheckItem>
                <PricingCheckItem>
                  Bezpečná platba a chat se zadáním
                </PricingCheckItem>
                <PricingCheckItem>Poplatek 12 % z objednávky</PricingCheckItem>
              </ul>
              <BrandPlanCta plan="starter" />
            </div>
            <div className="relative z-10 rounded-2xl border border-cyan/40 bg-panel p-8">
              <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-transparent bg-cyan px-4 py-1.5 font-body text-[11px] font-medium uppercase tracking-wide text-void">
                Nejoblíbenější
              </span>
              <h3 className="mt-2 font-display text-xl font-semibold">Growth</h3>
              <p className="mt-1.5 text-sm text-zinc-200">Pro pravidelné kampaně e-shopů</p>
              <p className="mt-7 font-display text-4xl font-extrabold text-cyan">
                2 990 Kč <span className="text-sm font-normal text-mist">/ měsíc</span>
              </p>
              <div className="my-6 h-px bg-white/10" />
              <ul className="space-y-3.5 text-sm text-zinc-200">
                <PricingCheckItem>Neomezené souběžné objednávky</PricingCheckItem>
                <PricingCheckItem>Pokročilé statistiky tvůrce</PricingCheckItem>
                <PricingCheckItem>Prioritní odpovědi a odznak Ověřená značka</PricingCheckItem>
                <PricingCheckItem>Poplatek jen 7 % z objednávky</PricingCheckItem>
              </ul>
              <BrandPlanCta plan="growth" />
            </div>
            <div className="relative rounded-2xl border border-white/[0.05] bg-panel p-8">
              <h3 className="font-display text-xl font-semibold">Scale</h3>
              <p className="mt-1.5 text-sm text-zinc-200">
                Pro značky s vlastním affiliate programem
              </p>
              <p className="mt-7 font-display text-4xl font-extrabold">Na míru</p>
              <div className="my-6 h-px bg-white/10" />
              <ul className="space-y-3.5 text-sm text-zinc-200">
                <PricingCheckItem>Dedikovaný account manager</PricingCheckItem>
                <PricingCheckItem>Hromadné kampaně napříč obory</PricingCheckItem>
                <PricingCheckItem>API napojení na e-shop</PricingCheckItem>
              </ul>
              <Link
                href={landingHref("firms", "kontakt")}
                className={cn(htmlButtonOutline, "mt-8 w-full text-center")}
              >
                Domluvit konzultaci
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />

      <section id="firms-cta" className="px-5 py-16 md:px-8 md:py-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/[0.05] bg-panel p-10 text-center md:p-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Připraven na první kampaň?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-200">
            Tvůj produkt si zaslouží správné publikum. Zadej platformu, obor a rozpočet a za
            chvilku uvidíš tvůrce, kteří ho umí prodat.
          </p>
          <a href="#marketplace" className={cn(htmlButtonCta, "mt-8 inline-block px-8 py-4")}>
            Otevřít tržiště
          </a>
        </div>
      </section>
    </main>
  );
}

/** @deprecated Use `FirmsPage`. */
export const FirmsView = FirmsPage;

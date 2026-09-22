"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Check,
  Film,
  Lock,
  Mail,
  Music2,
  Play,
  Star,
  Tag,
  Upload,
  Video,
} from "lucide-react";

import { BrandPlanCta } from "@/components/landing/brand-plan-cta";
import { CreatorsHeroSection } from "@/components/landing/creators-hero-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FirmsHeroSection } from "@/components/landing/firms-hero-section";
import { invokeAppGlobal, callAppHandler } from "@/lib/app-global";
import { landingHref } from "@/lib/landing-routes";
import {
  emptyState,
  emptyStateActions,
  emptyStateIcon,
  emptyStateSubtitle,
  emptyStateTitle,
  eyebrow,
  fieldControl,
  fieldLabel,
  htmlButtonCta,
  htmlButtonOutline,
  pricingCard,
  pricingIcon,
  section,
  surface,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

function CreatorGateLocked({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={cn("creator-gate-locked mt-12 w-full", emptyState)}>
      <div className={emptyStateIcon} aria-hidden>
        <Lock className="size-6" strokeWidth={1.5} />
      </div>
      <h3 className={emptyStateTitle}>{title}</h3>
      <p className={emptyStateSubtitle}>{description}</p>
      <div className={emptyStateActions}>
        <button
          type="button"
          className={htmlButtonCta}
          onClick={() => callAppHandler("goToCreatorDashboard")}
        >
          Přihlásit se
        </button>
      </div>
    </div>
  );
}

function PricingCheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan"
        aria-hidden
      >
        <Check className="size-3.5" strokeWidth={2.5} />
      </span>
      {children}
    </li>
  );
}

export function FirmsView() {
  return (
    <main id="view-firms">
      <FirmsHeroSection />
      <section id="marketplace" className="px-5 md:px-8 py-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl">Tržiště tvůrců</h2>
              <p className="text-zinc-200 mt-2 max-w-xl">
                Nastav platformu, obor a rozpočet. Seznam tvůrců se hned přizpůsobí, abys rychle
                našel ty, kteří sedí tvé značce i kampani.
              </p>
            </div>
            <div id="result-count" className="self-start rounded-sm border border-white/[0.09] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-mist tabular-nums" aria-live="polite"></div>
          </div>
          <div id="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"></div>
          <div id="empty-state" className="flex flex-col items-center rounded-md border border-white/[0.09] bg-panel px-6 py-14 text-center md:px-12 md:py-16 hidden" role="status" aria-live="polite">
            <div id="empty-state-icon" className="mb-5 flex size-12 items-center justify-center rounded-sm border border-white/[0.12] bg-white/[0.04] text-mist" aria-hidden="true"></div>
            <h3 id="empty-state-title" className="font-display text-lg font-semibold text-white md:text-xl">Žádný tvůrce neodpovídá filtru</h3>
            <p id="empty-state-subtitle" className="mt-2 max-w-md text-sm leading-relaxed text-zinc-200">Zkus zvýšit rozpočet nebo změnit platformu / obor.</p>
            <div id="empty-state-actions" className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button type="button" id="empty-state-cta-creator" className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5 hidden" onClick={() => invokeAppGlobal('openAuth', 'creator')}>Vytvořit profil tvůrce</button>
              <button type="button" id="empty-state-cta-reset" className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-white/[0.14] bg-white/[0.04] text-white/85 hover:bg-white/[0.09] hover:border-white/[0.24] h-auto gap-1.5 px-7 py-3.5 hidden" onClick={() => callAppHandler('resetMarketplaceFilters')}>Resetovat filtry</button>
            </div>
          </div>
        </div>
      </section>
      
      
      <section id="job-board" className="px-5 md:px-8 py-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl">Tržiště poptávek od značek</h2>
              <p className="text-zinc-200 mt-2 max-w-xl">
                Značky tu zveřejní zakázku s rozpočtem a zadáním. Tvůrci, kterým to sedí, se ozvou
                sami. Méně hledání, víc domlouvání.
              </p>
            </div>
            <div className="flex gap-2 border border-white/[0.09] bg-panel rounded-md p-1 self-start">
              <button id="subtab-browse" onClick={() => callAppHandler('switchJobTab', 'browse')} className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-xs border-transparent bg-transparent h-auto gap-1 px-4 py-2 text-mist hover:text-white [&.active]:bg-cyan [&.active]:text-void active">Nabídky k obsazení</button>
              <button id="subtab-brand" onClick={() => callAppHandler('switchJobTab', 'brand')} className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-xs border-transparent bg-transparent h-auto gap-1 px-4 py-2 text-mist hover:text-white [&.active]:bg-cyan [&.active]:text-void">Panel pro značky</button>
            </div>
          </div>
      
          <div id="jobs-browse">
            <div
              id="job-grid"
              className="grid hidden grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            />
            <div id="job-empty-state" className={emptyState} role="status" aria-live="polite">
              <div className={emptyStateIcon} aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-6"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
              </div>
              <h3 className={emptyStateTitle}>Zatím tu nejsou žádné poptávky</h3>
              <p className={emptyStateSubtitle}>
                Jakmile značka zveřejní zakázku, uvidíš ji tady. Máš značku a hledáš tvůrce? Zadej
                poptávku v panelu pro značky.
              </p>
              <div className={emptyStateActions}>
                <button type="button" className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5" onClick={() => callAppHandler('switchJobTab', 'brand')}>Zadat poptávku jako značka</button>
                <Link href={landingHref("firms", "marketplace")} className={htmlButtonOutline}>
                  Prohlédnout tvůrce
                </Link>
              </div>
            </div>
          </div>
      
          <div id="brand-panel" className="hidden">
            <div className={cn("brand-gate-locked w-full", emptyState)}>
              <div className={emptyStateIcon} aria-hidden>
                <Lock className="size-6" strokeWidth={1.5} />
              </div>
              <h3 className={emptyStateTitle}>Panel pro značky je pro přihlášené</h3>
              <p className={emptyStateSubtitle}>
                Přihlas se jako značka a spravuj tu své poptávky a přihlášené tvůrce.
              </p>
              <div className={emptyStateActions}>
                <button
                  type="button"
                  onClick={() => callAppHandler("goToBrandDashboard")}
                  className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5"
                >
                  Přihlásit se
                </button>
              </div>
            </div>
            <div className="brand-gate-unlocked hidden grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 border border-white/[0.09] bg-panel rounded-md p-7 md:p-9">
                <h3 className="font-display font-semibold text-lg mb-6">Publikovat novou poptávku</h3>
                <form onSubmit={(e) => { e.preventDefault(); callAppHandler('submitNewJob', e); }} className="space-y-5">
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Název inzerátu</label><input id="job-title" type="text" placeholder="např. TikToker na 3 videa/měsíc" className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" required /></div>
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Obor</label><div id="dd-job-category-mount"></div></div>
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Rozpočet (Kč)</label><input id="job-budget" type="number" min={0} step={500} placeholder="8000" className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" required /></div>
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Popis požadavků</label><textarea id="job-description" rows={3} placeholder="Co má tvůrce dodat, jaký formát a tón..." className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03] resize-none" required></textarea></div>
                  <button type="submit" className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5 w-full">Publikovat poptávku</button>
                </form>
              </div>
              <div className="lg:col-span-3">
                <h3 className="font-display font-semibold text-lg mb-5">Moje poptávky</h3>
                <div id="my-jobs-list" className="space-y-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      
      <section id="jak-to-funguje" className="px-5 md:px-8 py-16 md:py-12 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center">Jak to funguje pro značky</h2>
          <p className="text-zinc-200 text-center mt-3 max-w-xl mx-auto">Tři kroky mezi tvým produktem a hotovým promo videem na síti.</p>
          <div className="grid md:grid-cols-3 gap-6 mt-14">
            <div className="border border-white/[0.09] bg-panel rounded-md p-7 relative"><div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-cyan font-display text-xl font-bold text-void">1</div><h3 className="font-display font-semibold text-lg mb-2">Vybereš influencera</h3><p className="text-zinc-200 text-sm leading-relaxed">Podle ceny, platformy a oboru najdeš přesně toho tvůrce, jehož publikum kupuje produkty jako ten tvůj.</p></div>
            <div className="border border-white/[0.09] bg-panel rounded-md p-7 relative"><div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-cyan font-display text-xl font-bold text-void">2</div><h3 className="font-display font-semibold text-lg mb-2">Pošleš produkt a zadání</h3><p className="text-zinc-200 text-sm leading-relaxed">Briefing si domluvíš přímo v platformě. Napíšeš, co má video ukázat, jaký tón chceš a co má divák udělat jako další krok.</p></div>
            <div className="border border-white/[0.09] bg-panel rounded-md p-7 relative"><div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-cyan font-display text-xl font-bold text-void">3</div><h3 className="font-display font-semibold text-lg mb-2">Schválíš a získáš prodeje</h3><p className="text-zinc-200 text-sm leading-relaxed">Video zveřejní tvůrce, ty sleduješ dosah a konverze. Platba je držena v úschově až po tvém schválení.</p></div>
          </div>
        </div>
      </section>
      
      <section className="px-5 md:px-8 py-16 md:py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-md border border-white/[0.09] bg-panel p-8 md:flex-row md:p-10">
          <div>
            <span className="font-body text-[11px] font-medium uppercase tracking-wide text-cyan">Jsi influencer nebo UGC tvůrce?</span>
            <h3 className="font-display font-bold text-2xl md:text-3xl mt-2">Přepni se do Creator módu a nastav si vlastní profil</h3>
            <p className="text-zinc-200 mt-2 max-w-lg">Propojíš účet, systém ti vygeneruje kartu do tržiště a začneš dostávat placené nabídky.</p>
          </div>
          <Link href={landingHref("creators", "propojeni")} className={htmlButtonCta}>
            Přepnout na Pro tvůrce →
          </Link>
        </div>
      </section>
      
      
      <section id="cenik" className="px-5 md:px-8 py-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center">Ceníkové balíčky pro značky</h2>
          <p className="text-zinc-200 text-center mt-3 max-w-xl mx-auto">
            Platíš jen za kampaně, které skutečně proběhnou. Bez skrytých poplatků. Peníze držíme v
            úschově, dokud nebudeš s výsledkem spokojený.
          </p>
          <div className="mt-6 flex justify-center px-2">
            <div
              className="inline-flex max-w-2xl items-start gap-3 rounded-md border border-cyan/20 bg-cyan/[0.05] px-4 py-3 text-left sm:items-center"
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
          <div className="grid md:grid-cols-3 gap-7 mt-10 pt-3 md:items-stretch">
            <div className="relative rounded-md border border-white/[0.09] bg-panel p-8">
              <div className="mb-6 flex size-[52px] shrink-0 items-center justify-center rounded-sm bg-cyan text-void [&_svg]:size-6" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
              </div>
              <h3 className="font-display font-semibold text-xl">Starter</h3><p className="text-zinc-200 text-sm mt-1.5">Pro první test influencer marketingu</p>
              <p className="font-display font-extrabold text-4xl mt-7">0 Kč <span className="text-sm font-normal text-mist">/ měsíc</span></p>
              <div className="h-px bg-white/10 my-6"></div>
              <ul className="space-y-3.5 text-sm text-zinc-200">
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Neomezené procházení tržiště</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Objednávka u 1 tvůrce naráz</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Bezpečná platba (peníze držíme v úschově do schválení videa) a chat se zadáním</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Základní customizace profilu (avatar, bio, základní statistiky)</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Poplatek 12 % z objednávky</li>
              </ul>
              <BrandPlanCta plan="starter" />
            </div>
            <div className="relative rounded-md border border-white/[0.09] bg-panel p-8 border-magenta/40 z-10">
              <span className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-transparent bg-cyan px-4 py-1.5 font-body text-[11px] font-medium uppercase tracking-wide text-void font-body text-[11px] font-medium uppercase tracking-wide">Nejoblíbenější</span>
              <div className="mb-6 flex size-[52px] shrink-0 items-center justify-center rounded-sm bg-cyan text-void [&_svg]:size-6 mt-2" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
              </div>
              <h3 className="font-display font-semibold text-xl">Growth</h3><p className="text-zinc-200 text-sm mt-1.5">Pro pravidelné kampaně e-shopů</p>
              <p className="font-display font-extrabold text-4xl mt-7 text-cyan">2 990 Kč <span className="text-sm font-normal text-mist">/ měsíc</span></p>
              <div className="h-px bg-white/10 my-6"></div>
              <ul className="space-y-3.5 text-sm text-zinc-200">
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Neomezené souběžné objednávky</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Pokročilé statistiky tvůrce (detailní rozbor měsíčního dosahu, věku a demografie publika)</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Prioritní odpovědi tvůrců a odznak "Ověřená značka"</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Poplatek jen 7 % z objednávky</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Reporting dosahu, prokliků a export dat</li>
              </ul>
              <BrandPlanCta plan="growth" />
            </div>
            <div className="relative rounded-md border border-white/[0.09] bg-panel p-8">
              <div className="mb-6 flex size-[52px] shrink-0 items-center justify-center rounded-sm bg-cyan text-void [&_svg]:size-6" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              </div>
              <h3 className="font-display font-semibold text-xl">Scale</h3><p className="text-zinc-200 text-sm mt-1.5">Pro značky s vlastním affiliate programem</p>
              <p className="font-display font-extrabold text-4xl mt-7">Na míru</p>
              <div className="h-px bg-white/10 my-6"></div>
              <ul className="space-y-3.5 text-sm text-zinc-200">
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Dedikovaný account manager</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Hromadné kampaně napříč obory</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>API napojení na e-shop</li>
                <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-cyan/20 text-cyan" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Individuální provize</li>
              </ul>
              <button onClick={() => callAppHandler('openOrderIntent', 'Scale')} className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-white/[0.14] bg-white/[0.04] text-white/85 hover:bg-white/[0.09] hover:border-white/[0.24] h-auto gap-1.5 px-7 py-3.5 w-full mt-8">Domluvit konzultaci</button>
            </div>
          </div>
        </div>
      </section>
      
      
      <FaqSection />
      
      <section id="firms-cta" className="px-5 md:px-8 py-16 md:py-12">
        <div className="rounded-md border border-white/[0.09] bg-panel max-w-7xl mx-auto p-10 md:p-16 text-center relative overflow-hidden">
          <div className="relative">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Připraven na první kampaň?</h2>
            <p className="text-zinc-200 mt-3 max-w-lg mx-auto">
              Tvůj produkt si zaslouží správné publikum. Zadej platformu, obor a rozpočet a za chvilku uvidíš
              tvůrce, kteří ho umí prodat.
            </p>
            <a href="#marketplace" className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5 inline-block mt-8 font-display px-8 py-4">Otevřít tržiště</a>
          </div>
        </div>
      </section>
      
      
      
    </main>
  );
}

export function CreatorsView() {
  return (
    <main id="view-creators">
      <CreatorsHeroSection />

      <section id="propojeni" className={section}>
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center">
            Propoj účty a nastav si profil
          </h2>
          <p className="text-zinc-200 text-center mt-3 max-w-xl mx-auto">
            Zadáš odkazy na své sítě, přidáš libovolný počet balíčků s vlastní cenou i licencí a
            systém z nich sestaví kartu do tržiště.
          </p>

          <CreatorGateLocked
            title="Přihlas se, ať můžeš vytvořit profil"
            description="Propojení účtů a generování profilu do tržiště je dostupné jen přihlášeným tvůrcům."
          />

          <div className="creator-gate-unlocked hidden">
          <div className={cn(surface, "p-7 md:p-10 mt-12 grid lg:grid-cols-2 gap-10")}>
            <div>
              <span className={eyebrow}>Krok 1 — sociální sítě</span>
              <h3 className="font-display font-semibold text-xl mt-2 mb-5">Zadej své účty</h3>
              <div className="space-y-3">
                <div>
                  <label className={cn(fieldLabel, "mb-1.5 flex items-center gap-2")}>
                    <Music2 className="size-3.5 text-cyan" aria-hidden />
                    TikTok
                  </label>
                  <input id="handle-tiktok" type="text" placeholder="@tvuj_ucet" className={cn(fieldControl, "px-4 py-3")} />
                </div>
                <div>
                  <label className={cn(fieldLabel, "mb-1.5 flex items-center gap-2")}>
                    <Video className="size-3.5 text-cyan" aria-hidden />
                    Instagram
                  </label>
                  <input id="handle-instagram" type="text" placeholder="@tvuj_ucet" className={cn(fieldControl, "px-4 py-3")} />
                </div>
                <div>
                  <label className={cn(fieldLabel, "mb-1.5 flex items-center gap-2")}>
                    <Play className="size-3.5 text-cyan" aria-hidden />
                    YouTube
                  </label>
                  <input id="handle-youtube" type="text" placeholder="@tvuj_kanal" className={cn(fieldControl, "px-4 py-3")} />
                </div>
              </div>
              <p className="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide mt-2.5">Vyplň jen sítě, které používáš — zobrazí se jako odkazy na tvém profilu.</p>
      
              <div className="mt-7">
                <span className="font-body text-[11px] font-medium uppercase tracking-wide text-cyan">Statistiky (podle sebe)</span>
                <div className="grid grid-cols-3 gap-2.5 mt-3">
                  <div><label className="block text-[10px] font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Sledující</label><input id="stat-followers" type="number" min={0} placeholder="12000" className="w-full border border-white/[0.09] bg-panel rounded-sm px-3 py-2.5 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" /></div>
                  <div><label className="block text-[10px] font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Zhlédnutí/video</label><input id="stat-avgviews" type="number" min={0} placeholder="3000" className="w-full border border-white/[0.09] bg-panel rounded-sm px-3 py-2.5 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" /></div>
                  <div><label className="block text-[10px] font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Dosah/30 dní</label><input id="stat-reach" type="number" min={0} placeholder="8000" className="w-full border border-white/[0.09] bg-panel rounded-sm px-3 py-2.5 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" /></div>
                </div>
              </div>
            </div>
      
            <div>
              <span className="font-body text-[11px] font-medium uppercase tracking-wide text-cyan">Krok 2 — jméno, avatar a obor</span>
              <h3 className="font-display font-semibold text-xl mt-2 mb-5">Doladit profil</h3>
      
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-[88px] w-[88px] cursor-pointer items-center justify-center overflow-hidden rounded-full rounded-full bg-gradient-to-br from-violet via-magenta to-cyan p-[2.5px]" onClick={() => document.getElementById('avatar-upload')?.click()}>
                  <div id="avatar-preview" className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-display font-bold text-white">?</div>
                </div>
                <div>
                  <button type="button" onClick={() => document.getElementById('avatar-upload')?.click()} className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-xs border-white/[0.14] bg-white/[0.04] text-white/85 hover:bg-white/[0.09] hover:border-white/[0.24] h-auto gap-1 px-4 py-2">Nahrát fotku</button>
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" />
                  <p className="text-zinc-200 text-[11px] mt-2 font-mono text-[11px] tracking-wide">JPG / PNG, čtvercový výřez</p>
                </div>
              </div>
      
              <label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-2">Zobrazované jméno (např. Jana K.)</label>
              <input id="profile-display-name" type="text" placeholder="Jana K." className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03] mb-6" />
      
              <label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-2">Obor</label>
              <div id="dd-profile-category-mount" className="mb-7"></div>
      
              <button onClick={() => callAppHandler('generateRealProfile')} className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5 w-full">Vygenerovat profil do tržiště</button>
              <p id="profile-error" className="text-xs mt-3 hidden" style={{ color: '#ff8fd6' }}>Vyplň jméno a přidej alespoň jeden balíček níže.</p>
              <p id="profile-success" className="text-xs mt-3 hidden" style={{ color: '#00E5FF' }}></p>
              <Link
                id="profile-view-btn"
                href={landingHref("firms", "marketplace")}
                className={cn(htmlButtonOutline, "hidden w-full mt-3")}
              >
                Zobrazit v tržišti →
              </Link>
            </div>
          </div>
      
          
          <div className="border border-white/[0.09] bg-panel rounded-md p-7 md:p-10 mt-8">
            <span className="font-body text-[11px] font-medium uppercase tracking-wide text-cyan">Krok 3 — balíčky tvého profilu</span>
            <h3 className="font-display font-semibold text-xl mt-2 mb-1">Přidej libovolný počet balíčků</h3>
            <p className="text-zinc-200 text-sm mb-7">Každý balíček se v katalogu zobrazí jako samostatná záložka s vlastní cenou, dobou doručení a licencí.</p>
      
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-5">
                <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Název balíčku</label><input id="staging-name" type="text" placeholder="např. TikTok video balíček" className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" /></div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Formát</label><div id="dd-staging-format-mount"></div></div>
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Doba doručení</label><div id="dd-staging-delivery-mount"></div></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Počet revizí</label><input id="staging-revisions" type="number" min={0} max={5} defaultValue={1} className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" /></div>
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Cena (Kč)</label><input id="staging-price" type="number" min={0} step={100} placeholder="2000" className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" /></div>
                </div>
                <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Délka licence pro reklamu (Meta/TikTok Ads)</label><div id="dd-staging-license-mount"></div></div>
                <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Popis balíčku</label><textarea id="staging-description" rows={2} placeholder="Co přesně balíček obsahuje..." className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03] resize-none"></textarea></div>
                <button type="button" onClick={() => callAppHandler('addStagingPackage')} className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-white/[0.14] bg-white/[0.04] text-white/85 hover:bg-white/[0.09] hover:border-white/[0.24] h-auto gap-1.5 px-7 py-3.5 w-full py-3">+ Přidat balíček do profilu</button>
              </div>
              <div className="lg:col-span-2">
                <p className="text-xs font-mono text-[11px] tracking-wide uppercase text-zinc-200 mb-3">Rozpracované balíčky (<span id="staging-count">0</span>)</p>
                <div id="staging-packages-list" className="space-y-3"></div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
      
      
      <section id="dashboard" className={section}>
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center">Dashboard pro tvůrce</h2>
          <p className="text-zinc-200 text-center mt-3 max-w-xl mx-auto">Přehled tvých objednávek a místo pro nahrání hotového obsahu.</p>

          <CreatorGateLocked
            title="Tahle sekce je jen pro přihlášené tvůrce"
            description="Přihlas se, ať vidíš své objednávky a můžeš nahrávat hotový obsah."
          />

          <div className="creator-gate-unlocked hidden">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
              <div className={cn(surface, "p-7 transition-all duration-300 hover:-translate-y-1 hover:border-magenta/40")}><p className="text-zinc-200 text-xs font-mono tracking-wide uppercase mb-2">Celkový výdělek</p><p className="font-display font-extrabold text-3xl text-cyan">0 Kč</p><p className="text-zinc-200 text-xs mt-2">zatím žádné dokončené objednávky</p></div>
              <div className={cn(surface, "p-7 transition-all duration-300 hover:-translate-y-1 hover:border-magenta/40")}><p className="text-zinc-200 text-xs font-mono tracking-wide uppercase mb-2">Aktivní objednávky</p><p className="font-display font-extrabold text-3xl">0</p><p className="text-zinc-200 text-xs mt-2">čekají na nahrání nebo schválení</p></div>
              <div className={cn(surface, "p-7 transition-all duration-300 hover:-translate-y-1 hover:border-magenta/40")}><p className="text-zinc-200 text-xs font-mono tracking-wide uppercase mb-2">Dokončené kampaně</p><p className="font-display font-extrabold text-3xl">0</p><p className="text-zinc-200 text-xs mt-2">za celou dobu na platformě</p></div>
              <div className={cn(surface, "p-7 transition-all duration-300 hover:-translate-y-1 hover:border-magenta/40")} id="profile-views-card"></div>
            </div>
            <div className="grid lg:grid-cols-5 gap-6 mt-8">
              <div className="lg:col-span-2 border border-white/[0.09] bg-panel rounded-md p-7">
                <h3 className="font-display font-semibold text-lg mb-5">Aktivní objednávky</h3>
                <div id="creator-orders-list" className="space-y-3">
                  <div className="border border-white/[0.09] bg-panel rounded-xl p-5 text-center text-mist text-sm">Zatím žádné objednávky. Jakmile ti někdo pošle poptávku, objeví se tady.</div>
                </div>
              </div>
              <div className="lg:col-span-3 border border-white/[0.09] bg-panel rounded-md p-7">
                <h3 className="font-display font-semibold text-lg mb-1">Nahrát hotové video</h3>
                <p className="text-zinc-200 text-sm mb-5">Podporované formáty: MP4, MOV. Po nahrání odešleme obsah zadavateli ke schválení.</p>
                <div id="dropzone" className="border-2 border-dashed border-white/[0.18] transition-all duration-300 [&.drag-over]:border-magenta [&.drag-over]:bg-magenta/[0.06] [&.drag-over]:shadow-[0_0_0_6px_rgba(232,56,255,0.06)] rounded-2xl p-10 text-center cursor-pointer" onClick={() => document.getElementById('file-input')?.click()}>
                  <input id="file-input" type="file" accept=".mp4,.mov,video/mp4,video/quicktime" className="hidden" />
                  <div id="dropzone-empty">
                    <div className={cn(emptyStateIcon, "mx-auto mb-4")} aria-hidden>
                      <Upload className="size-6" strokeWidth={1.5} />
                    </div>
                    <p className="font-semibold text-sm">Přetáhni sem video, nebo klikni pro výběr souboru</p>
                    <p className="text-zinc-200 text-xs mt-2 font-mono tracking-wide">MP4 / MOV · max. 500 MB</p>
                  </div>
                  <div id="dropzone-file" className="hidden">
                    <div className={cn(pricingIcon, "mx-auto mb-4 rounded-sm")} aria-hidden>
                      <Film className="size-6" strokeWidth={1.5} />
                    </div>
                    <p id="file-name" className="font-semibold text-sm"></p><p id="file-size" className="text-zinc-200 text-xs mt-2 font-mono text-[11px] tracking-wide"></p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <div id="dd-upload-order-mount" className="flex-1"></div>
                  <button onClick={() => callAppHandler('submitUpload')} className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5 px-6 py-3 whitespace-nowrap">Odeslat ke schválení</button>
                </div>
                <p id="upload-msg" className="text-xs mt-3 font-mono text-[11px] tracking-wide hidden"></p>
              </div>
            </div>
      
            <div className="border border-white/[0.09] bg-panel rounded-md p-7 mt-6">
              <h3 className="font-display font-semibold text-lg mb-5">Zprávy</h3>
              <div id="creator-conversations-list" className="space-y-3"></div>
            </div>
          </div>
        </div>
      </section>
      
      
      <section id="balicky" className={section}>
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center">Tvorba a správa balíčků</h2>
          <p className="text-zinc-200 text-center mt-3 max-w-xl mx-auto">Balíčky, které tu vytvoříš, se značkám zobrazí přesně takto po rozkliknutí tvého profilu v tržišti.</p>

          <CreatorGateLocked
            title="Přihlas se pro správu balíčků"
            description="Balíčky patří k tvému profilu, proto je vidíš a upravuješ jen po přihlášení."
          />
      
          <div className="creator-gate-unlocked hidden grid lg:grid-cols-5 gap-6 mt-14">
            <div className="lg:col-span-3 border border-white/[0.09] bg-panel rounded-md p-7 md:p-9">
              <h3 id="pkg-form-title" className="font-display font-semibold text-lg mb-6">Nový balíček</h3>
              <form id="package-form" onSubmit={(e) => { e.preventDefault(); callAppHandler('submitPackageForm', e); }} className="space-y-5">
                <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Název balíčku</label><input id="pkg-name" type="text" placeholder="např. Instagram Reel balíček" className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" required /></div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Typ formátu</label><div id="dd-pkg-format-mount"></div></div>
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Doba doručení</label><div id="dd-pkg-delivery-mount"></div></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Počet revizí</label><input id="pkg-revisions" type="number" min={0} max={5} defaultValue={1} className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" required /></div>
                  <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Cena (Kč)</label><input id="pkg-price" type="number" min={0} step={100} placeholder="2500" className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" required /></div>
                </div>
                <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Délka licence pro reklamu (Meta/TikTok Ads)</label><div id="dd-pkg-license-mount"></div></div>
                <div><label className="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Popis balíčku (rozsah, práva k reklamě...)</label><textarea id="pkg-description" rows={3} placeholder="Např. 1× Reel + 2× Story, publikace na tvém profilu." className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03] resize-none" required></textarea></div>
                <div className="flex gap-3">
                  <button type="submit" id="pkg-submit-btn" className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5 flex-1">Přidat balíček</button>
                  <button type="button" id="pkg-cancel-btn" onClick={() => callAppHandler('cancelPackageEdit')} className="hidden inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-white/[0.14] bg-white/[0.04] text-white/85 hover:bg-white/[0.09] hover:border-white/[0.24] h-auto gap-1.5 px-7 py-3.5 px-6">Zrušit</button>
                </div>
              </form>
            </div>
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-lg mb-5">Tvé aktivní balíčky</h3>
              <div id="my-packages-list" className="space-y-3"></div>
            </div>
          </div>
        </div>
      </section>
      
      
      <section id="creator-pro" className={section}>
        <div className="max-w-7xl mx-auto text-center">
          <span className={eyebrow}>Pro aktivní tvůrce</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">Creator PRO</h2>
          <p className="text-zinc-200 mt-3 max-w-xl mx-auto">Bez limitů na počet balíčků, s předností na tržišti a přehledem o tom, kdo si tvůj profil prohlíží.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-7 mt-10 pt-3 md:items-stretch">
          <div className={cn(pricingCard, "md:col-start-2")}>
            <div className={pricingIcon} aria-hidden>
              <Star className="size-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-display font-semibold text-xl">Creator PRO</h3>
            <p className="text-zinc-200 text-sm mt-1.5">Pro tvůrce, kteří to myslí vážně</p>
            <p className="font-display font-extrabold text-4xl mt-7">
              99 Kč <span className="text-sm font-normal text-mist">/ měsíc</span>
            </p>
            <div className="h-px bg-white/10 my-6" />
            <ul className="space-y-3.5 text-sm text-zinc-200">
              <PricingCheckItem>Neomezený počet inzerátů a nabídek</PricingCheckItem>
              <PricingCheckItem>Topování na tržišti (přednostní výpis)</PricingCheckItem>
              <PricingCheckItem>Odznak &quot;PRO Tvůrce&quot; na profilu</PricingCheckItem>
              <PricingCheckItem>Přehled zobrazení profilu (kolik značek vidělo tvou kartu)</PricingCheckItem>
              <PricingCheckItem>Prioritní notifikace o nových poptávkách</PricingCheckItem>
            </ul>
            <button
              id="creator-pro-btn"
              type="button"
              onClick={() => callAppHandler("handleCheckout", "creatorPro")}
              className={cn(htmlButtonCta, "w-full mt-8")}
            >
              Upgradovat na Creator PRO
            </button>
            <p className="text-center text-[11px] text-zinc-200 font-mono tracking-wide mt-3">
              Bezplatný účet: max. 2 aktivní inzeráty/balíčky
            </p>
          </div>
        </div>
      </section>
      
      
      
    </main>
  );
}

export function ContactSection() {
  return (
    
    
    <section id="kontakt" className="px-5 md:px-8 py-16 md:py-12">
      <div className="rounded-md border border-white/[0.09] bg-panel max-w-7xl mx-auto p-8 md:p-14 grid md:grid-cols-2 gap-10">
        <div>
          <span className="font-body text-[11px] font-medium uppercase tracking-wide text-cyan">Kontakt</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">Máš dotaz? Ozveme se.</h2>
          <p className="text-zinc-200 mt-4 max-w-md">Ať jsi firma, nebo tvůrce, náš support odpovídá do 1 pracovního dne.</p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-cyan text-void"
                aria-hidden
              >
                <Mail className="size-4" />
              </span>
              podpora@promobazar.cz
            </div>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); callAppHandler('submitContact', e); }} className="space-y-4">
          <div><label className="mb-1.5 block font-body text-sm font-medium text-zinc-200">Jméno</label><input className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" required /></div>
          <div><label className="mb-1.5 block font-body text-sm font-medium text-zinc-200">E-mail</label><input type="email" className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03]" required /></div>
          <div><label className="mb-1.5 block font-body text-sm font-medium text-zinc-200">Zpráva</label><textarea rows={3} className="w-full border border-white/[0.09] bg-panel rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:bg-white/[0.03] resize-none" required></textarea></div>
          <button type="submit" className="inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5 w-full">Odeslat zprávu</button>
        </form>
      </div>
    </section>
  );
}

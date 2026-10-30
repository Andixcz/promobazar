"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Link2,
  MessageSquare,
  Package,
  Star,
  Wallet,
} from "lucide-react";

import { useMember } from "@/components/shared/member-context";
import { Button } from "@/components/ui/button";
import { StepIllustration } from "@/components/ui/step-illustration";
import { AUTH_LOGIN_PATH, AUTH_REGISTER_PATH } from "@/lib/auth-routes";
import { DASHBOARD_HOME_PATH, dashboardPath } from "@/lib/dashboard-routes";
import { landingHref } from "@/lib/landing-routes";
import { scrollToSection } from "@/lib/scroll-to-section";
import {
  htmlButtonCta,
  htmlButtonOutline,
  landingHeroTopPadding,
  pricingCard,
  pricingIcon,
  pricingListCheckBox,
  section,
  sectionX,
  surface,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

const heroStats = [
  { value: "0 Kč", label: "registrace zdarma" },
  { value: "48 h", label: "výplata po schválení" },
  { value: "TY", label: "si nastavuješ ceny" },
] as const;

const creatorRegisterHref = `${AUTH_REGISTER_PATH}?role=creator`;
const creatorLoginHref = `${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent(
  `${DASHBOARD_HOME_PATH}?role=creator`,
)}`;

const stepPanelClass =
  "relative rounded-2xl border border-white/[0.05] bg-panel p-7";

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

function CreatorDashboardBanner() {
  const { isPending, isCreator } = useMember();

  if (isPending || !isCreator) return null;

  return (
    <div className={cn(section, "pt-0")}>
      <div className="mx-auto max-w-7xl">
        <div className={cn(surface, "flex flex-col items-center gap-6 p-8 text-center md:flex-row md:p-10 md:text-left")}>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Profil, balíčky, objednávky. Jdeme na to.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-200">
              Uprav nabídku, odpověz na poptávku, sleduj platby. Vše po přihlášení v účtu.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-3">
            <Link href={dashboardPath("profil")} className={htmlButtonCta}>
              Otevřít profil
            </Link>
            <Link href={dashboardPath("balicky")} className={htmlButtonOutline}>
              Balíčky
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Obsah `/pro-tvurce`. */
export function CreatorsPage() {
  return (
    <main id="view-creators">
      <section
        id="top"
        className={cn("relative pb-16 md:pb-20", landingHeroTopPadding, sectionX)}
      >
        <div className="mx-auto max-w-7xl animate-fade-up text-center">
          <h1 className="font-display text-[2.15rem] font-extrabold leading-[1.08] tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Tvoje videa prodávají.
            <br />
            <span className="text-cyan">Ať ti za to taky zaplatí.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-200 md:text-lg">
            Založ profil, hoď na tržiště balíčky s cenou a nech značky objednávat na klik. Platbu
            držíme v úschově a po schválení ti ji pošleme na účet.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={creatorRegisterHref} className={htmlButtonCta}>
              Chci profil tvůrce
            </Link>
            <Button type="button" variant="outline" onClick={() => scrollToSection("jak-to-funguje")}>
              Ukaž mi postup
            </Button>
          </div>
          <p className="mt-4 text-sm text-mist">
            Už máš účet?{" "}
            <Link href={creatorLoginHref} className="text-cyan hover:underline">
              Přihlásit se
            </Link>
          </p>
          <div
            className="mx-auto mt-14 flex w-full max-w-4xl flex-col gap-8 animate-fade-up sm:flex-row sm:items-stretch sm:justify-center sm:gap-0"
            style={{ animationDelay: ".1s" }}
          >
            {heroStats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center text-center px-6 sm:px-8 md:px-10",
                  index > 0 && "sm:border-l sm:border-cyan/45",
                )}
              >
                <p className="font-display text-3xl font-bold leading-none tracking-tight text-cyan md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 max-w-[11rem] text-xs leading-snug text-mist sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CreatorDashboardBanner />

      <section id="jak-to-funguje" className={section}>
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
            Jak to funguje pro tvůrce
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-200">
            Tři kroky. Žádné domlouvání ve zprávách. Jen jasný proces a peníze, které nepřijdou pozdě.
          </p>
          <div className="mt-14 grid gap-2 md:grid-cols-3">
            <div className={stepPanelClass}>
              <StepIllustration step={1} />
              <h3 className="font-display text-lg font-semibold">Profil, co zaujme na první pohled</h3>
              <p className="text-sm leading-relaxed text-zinc-200">
                Propoj sítě, ukaž portfolio, nastav obor. Značky vidí kartu s čísly, ne tvůj soukromý
                inbox.
              </p>
            </div>
            <div className={stepPanelClass}>
              <StepIllustration step={2} />
              <h3 className="font-display text-lg font-semibold">Objednávka bez vyjednávání</h3>
              <p className="text-sm leading-relaxed text-zinc-200">
                Cenu, rozsah a termín máš v balíčku. Značka objedná z tržiště. Ty do 48 hodin
                přijmeš, nebo odmítneš.
              </p>
            </div>
            <div className={stepPanelClass}>
              <StepIllustration step={3} />
              <h3 className="font-display text-lg font-semibold">Schváleno znamená zaplaceno</h3>
              <p className="text-sm leading-relaxed text-zinc-200">
                Zadání, soubory i opravy u jedné objednávky v chatu. Značka schválí hotový obsah, my
                uvolníme platbu z úschovy. Na účet ti většinou dorazí do 48 hodin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="propojeni" className={section}>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ať tě značky poznaj, ne obtěžují
            </h2>
            <p className="mt-3 text-zinc-200">
              Karta v tržišti ukáže, co umíš a komu sedíš. Kontakty si necháš pro sebe. Objednávky
              chodí přes platformu.
            </p>
          </div>
          <div className="mt-12 grid gap-2 md:grid-cols-2">
            <div className={stepPanelClass}>
              <div className="mb-4 flex size-11 items-center justify-center rounded-sm bg-cyan/15 text-cyan">
                <Link2 className="size-5" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="font-display text-lg font-semibold">Sítě propojíš na klik</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                Instagram, TikTok, co používáš. V katalogu ukážeme dosah a reakce publika.
              </p>
            </div>
            <div className={stepPanelClass}>
              <div className="mb-4 flex size-11 items-center justify-center rounded-sm bg-cyan/15 text-cyan">
                <MessageSquare className="size-5" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="font-display text-lg font-semibold">Chat u zakázky, ne chaos v hlavě</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                Zadání, soubory, revize. Vše u objednávky, ne roztříštěné po pěti aplikacích.
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Link href={creatorRegisterHref} className={htmlButtonOutline}>
              Chci svůj profil
            </Link>
          </div>
        </div>
      </section>

      <section id="balicky" className={section}>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Řekni cenu dřív, než natočíš první snímek
            </h2>
            <p className="mt-3 text-zinc-200">
              Balíček = jasný deal. Formát, rozsah, termín. Značka ví, co kupuje. Ty víš, za co
              makáš.
            </p>
          </div>
          <div className="mt-12 grid gap-2 md:grid-cols-3">
            <div className={stepPanelClass}>
              <div className="mb-4 flex size-11 items-center justify-center rounded-sm bg-cyan/15 text-cyan">
                <Package className="size-5" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="font-display text-lg font-semibold">Co přesně dodáš</h3>
              <p className="text-sm leading-relaxed text-zinc-200">
                Reels, TikTok, UGC, délka, revize, práva k reklamě. Napíšeš to jednou v balíčku a
                nemusíš to vysvětlovat po sté.
              </p>
            </div>
            <div className={stepPanelClass}>
              <div className="mb-4 flex size-11 items-center justify-center rounded-sm bg-cyan/15 text-cyan">
                <Wallet className="size-5" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="font-display text-lg font-semibold">Tvoje cena, tvoje pravidla</h3>
              <p className="text-sm leading-relaxed text-zinc-200">
                Nastavíš ji ty. Značka platí dopředu do úschovy. My peníze pustíme až po schválení.
                Žádné „pošleme ti to příští týden“.
              </p>
            </div>
            <div className={stepPanelClass}>
              <div className="mb-4 flex size-11 items-center justify-center rounded-sm bg-cyan/15 text-cyan">
                <Check className="size-5" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="font-display text-lg font-semibold">Víc nabídek, víc příležitostí</h3>
              <p className="text-sm leading-relaxed text-zinc-200">
                Jedno Reels, balík UGC, licence pro placenou reklamu. V základu pár aktivních balíčků, s Creator PRO
                jedeš neomezeně.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="creator-pro" className={section}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Začni zdarma. Šlápni na plyn s PRO.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-200">
              Základ ti stačí na rozjezd. Když objednávek přibude, PRO tě posune výš ve vyhledávání.
            </p>
          </div>
          <div className="mt-10 grid gap-2 pt-3 md:grid-cols-2 md:items-stretch lg:mx-auto lg:max-w-4xl">
            <div className={cn(pricingCard, "p-8")}>
              <h3 className="font-display text-xl font-semibold">Základ</h3>
              <p className="mt-1.5 text-sm text-zinc-200">První zakázky, nulové riziko</p>
              <p className="mt-7 font-display text-4xl font-extrabold">
                0 Kč <span className="text-sm font-normal text-mist">/ měsíc</span>
              </p>
              <div className="my-6 h-px bg-white/10" />
              <ul className="space-y-3.5 text-sm text-zinc-200">
                <PricingCheckItem>Veřejný profil v tržišti a chat u objednávek</PricingCheckItem>
                <PricingCheckItem>Platba v úschově a výplata na tvůj účet</PricingCheckItem>
                <PricingCheckItem>Omezený počet aktivních balíčků</PricingCheckItem>
                <PricingCheckItem>Standardní zobrazení ve vyhledávání</PricingCheckItem>
              </ul>
              <Link
                href={creatorRegisterHref}
                className={cn(htmlButtonOutline, "mt-8 w-full text-center")}
              >
                Založit zdarma
              </Link>
            </div>
            <div className="relative z-10 rounded-2xl border border-cyan/40 bg-panel p-8">
              <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-transparent bg-cyan px-4 py-1.5 font-body text-[11px] font-medium uppercase tracking-wide text-void">
                Doporučujeme
              </span>
              <div className={cn(pricingIcon, "mt-2")} aria-hidden>
                <Star className="size-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold">Creator PRO</h3>
              <p className="mt-1.5 text-sm text-zinc-200">Když to myslíš s tvorbou vážně</p>
              <p className="mt-7 font-display text-4xl font-extrabold text-cyan">
                99 Kč <span className="text-sm font-normal text-mist">/ měsíc</span>
              </p>
              <div className="my-6 h-px bg-white/10" />
              <ul className="space-y-3.5 text-sm text-zinc-200">
                <PricingCheckItem>Neomezený počet aktivních balíčků</PricingCheckItem>
                <PricingCheckItem>Přednostní zobrazení v tržišti</PricingCheckItem>
                <PricingCheckItem>Odznak PRO u profilu</PricingCheckItem>
                <PricingCheckItem>Statistiky zobrazení profilu</PricingCheckItem>
                <PricingCheckItem>Prioritní upozornění na poptávky</PricingCheckItem>
              </ul>
              <Link href={creatorRegisterHref} className={cn(htmlButtonCta, "mt-8 w-full text-center")}>
                Chci PRO po registraci
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="creators-cta" className={section}>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/[0.05] bg-panel p-10 text-center md:p-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Přestaň prodávat sám sebe v inboxu
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-200">
            Pár minut a jsi v tržišti. Značky tě najdou, objednají, zaplatí. Ty točíš, my hlídáme
            úschovu.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={creatorRegisterHref} className={cn(htmlButtonCta, "inline-flex px-8 py-4")}>
              Chci profil tvůrce
            </Link>
            <Link href={landingHref("firms", "marketplace")} className={htmlButtonOutline}>
              Kdo už tu je?
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/** @deprecated Use `CreatorsPage`. */
export const CreatorsView = CreatorsPage;

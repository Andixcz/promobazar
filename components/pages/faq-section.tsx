"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { landingCardStack } from "@/lib/ui-surfaces";

export type FaqItem = { question: string; answer: string };

export const BRAND_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Co je to bezpečná platba a proč je bez rizika?",
    answer:
      "Zaplatíš celou částku předem a peníze držíme do schválení. Tvůrce má 48 hodin na přijetí. Když odmítne, částka se vrací. Na kontrolu výstupu máš 3 dny.",
  },
  {
    question: "Proč nevidím přímý kontakt na tvůrce?",
    answer:
      "Veškerá komunikace probíhá přes platformu, aby byla chráněná bezpečnou platbou v úschově a reklamačním řádem. Kontaktní údaje a přímé odkazy na sociální sítě se proto v katalogu ani v poptávce nezobrazují.",
  },
  {
    question: "Jak dlouho trvá realizace jedné kampaně?",
    answer:
      "Většina tvůrců dodá hotové video do 3 až 14 pracovních dní podle zvoleného balíčku. Přesný termín vidíš u každého balíčku ještě před objednáním.",
  },
  {
    question: "Co když nejsem spokojený s výsledkem?",
    answer:
      "Máš jedno kolo úprav, do 3 dnů od odevzdání. Když výstup pořád nesedí, napiš na podporu.",
  },
];

export const CREATOR_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Platí se za registraci?",
    answer:
      "Ne. Profil v tržišti a objednávky jsou zdarma. Creator PRO za 99 Kč měsíčně je volba navíc: neomezené balíčky, lepší pozice v hledání a statistiky profilu.",
  },
  {
    question: "Kdy mi skočí platba na účet?",
    answer:
      "Až značka schválí hotový obsah. Peníze z úschovy ti pošleme na účet, většinou do 48 hodin. Výplatu nastavíš v Nastavení po přihlášení.",
  },
  {
    question: "Musím mít mega reach?",
    answer:
      "Ne. UGC i menší profily tu mají smysl. Značky koukají na styl, obor a balíčky, ne jen na počet sledujících.",
  },
  {
    question: "Jak vypadá jedna zakázka?",
    answer:
      "Značka objedná balíček z tržiště. Máš 48 hodin na ano nebo ne. Zadání, soubory a revize jsou v chatu u objednávky. Kontakty mimo platformu neřešíš.",
  },
];

/** @deprecated Use `BRAND_FAQ_ITEMS`. */
export const FAQ_ITEMS = BRAND_FAQ_ITEMS;

export function FaqSection({ items = BRAND_FAQ_ITEMS }: { items?: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="px-5 md:px-8 py-16 md:py-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
          Časté otázky
        </h2>
        <div className="mt-12 flex flex-col gap-2">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={cn(
                  landingCardStack,
                  "overflow-hidden rounded-md first:rounded-t-2xl last:rounded-b-2xl border transition-[border-color,background-color,box-shadow] duration-300 ease-out",
                  isOpen
                    ? "border-cyan bg-[var(--color-cyan)]"
                    : "border-white/[0.09] hover:border-white/[0.16]"
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span
                    className={cn(
                      "pr-2 font-semibold leading-snug transition-colors duration-200",
                      isOpen ? "text-void" : "text-foreground/95"
                    )}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 transition-transform duration-300 ease-out",
                      isOpen ? "rotate-180 text-void" : "text-cyan"
                    )}
                    aria-hidden
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className={cn(
                        "border-t px-5 pb-5 pt-4 transition-[opacity,background-color,border-color] duration-300 md:px-6 md:pb-6",
                        isOpen
                          ? "border-void/10 bg-void/65 opacity-100"
                          : "border-white/[0.08] opacity-0"
                      )}
                    >
                      <p className={cn("text-sm leading-relaxed md:max-w-3/4", isOpen ? "text-white" : "text-zinc-200")}>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

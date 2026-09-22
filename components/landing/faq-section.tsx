"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Co je to bezpečná platba a proč je bez rizika?",
    answer:
      "Při objednání pošleš peníze na zabezpečený účet promobazar.cz, kde je držíme v úschově. Tvůrce je dostane vyplacené až ve chvíli, kdy ty osobně schválíš hotové video nebo fotky. Pokud výstup neodpovídá zadání, peníze se vrací.",
  },
  {
    question: "Proč nevidím přímý kontakt na tvůrce?",
    answer:
      "Veškerá komunikace probíhá přes platformu, aby byla chráněná bezpečnou platbou v úschově a reklamačním řádem. Kontaktní údaje a přímé odkazy na sociální sítě se proto v katalogu ani v poptávce nezobrazují.",
  },
  {
    question: "Jak dlouho trvá realizace jedné kampaně?",
    answer:
      "Většina tvůrců dodá hotové video do 3–14 pracovních dní podle zvoleného balíčku. Přesný termín vidíš u každého balíčku ještě před objednáním.",
  },
  {
    question: "Co když nejsem spokojený s výsledkem?",
    answer:
      "V rámci zadání máš nárok na jedno kolo úprav zdarma. Pokud výstup přesto neodpovídá dohodnutému briefu, můžeš situaci nahlásit naší podpoře, která pomůže nalézt férové řešení pro obě strany.",
  },
] as const;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="px-5 md:px-8 py-16 md:py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
          Časté otázky
        </h2>
        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={cn(
                  "overflow-hidden rounded-md border bg-panel transition-[border-color,background-color,box-shadow] duration-300 ease-out",
                  isOpen
                    ? "border-cyan/35 bg-cyan/[0.09] shadow-[inset_0_1px_0_0_rgba(0,229,255,0.22)]"
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
                      isOpen ? "text-white" : "text-foreground/95"
                    )}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-cyan transition-transform duration-300 ease-out",
                      isOpen && "rotate-180"
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
                          ? "border-cyan/20 bg-cyan/[0.06] opacity-100"
                          : "border-white/[0.08] opacity-0"
                      )}
                    >
                      <p className="text-sm leading-relaxed text-zinc-200">
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

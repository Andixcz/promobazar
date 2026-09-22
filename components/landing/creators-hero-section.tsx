"use client";

import { Button } from "@/components/ui/button";
import { callAppHandler } from "@/lib/app-global";
import { scrollToSection } from "@/lib/scroll-to-section";
import { eyebrow, sectionX, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

const statCards = [
  { value: "0 Kč", label: "registrace a profil" },
  { value: "48 h", label: "výplata po schválení" },
  { value: "Ty", label: "nastavuješ ceny" },
] as const;

/** Hero pro stránku Pro tvůrce — stejný jazyk vizuálu jako FirmsHeroSection. */
export function CreatorsHeroSection() {
  return (
    <section id="top" className={cn("relative pt-40 sm:pt-32 pb-16 md:pb-20", sectionX)}>
      <div className="max-w-7xl mx-auto text-center animate-fade-up">
        <h1 className="font-display font-extrabold leading-[1.08] text-[2.15rem] sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
          Propoj profil.
          <br />
          <span className="text-cyan">Získej nabídky.</span>
          <br />
          Nahraj video.
        </h1>
        <p className="mt-6 text-zinc-200 text-base md:text-lg max-w-2xl mx-auto">
          Bez ceníků pro značky, bez zbytečných kroků. Propojíš účty, nastavíš si ceny podle
          platformy a systém ti vygeneruje kartu rovnou do tržiště.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Button
            type="button"
            onClick={() => scrollToSection("propojeni")}
          >
            Propojit profil
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => callAppHandler("goToCreatorDashboard")}
          >
            Zobrazit dashboard
          </Button>
        </div>
      </div>
      <div
        className="max-w-7xl mx-auto grid grid-cols-3 gap-4 mt-14 animate-fade-up"
        style={{ animationDelay: ".1s" }}
      >
        {statCards.map((card) => (
          <div key={card.label} className={cn("p-5 text-center", surface)}>
            <p className="font-display font-bold text-2xl text-cyan">{card.value}</p>
            <p className="text-zinc-200 text-xs mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

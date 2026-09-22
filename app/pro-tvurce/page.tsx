import type { Metadata } from "next";

import { FaqSection } from "@/components/landing/faq-section";
import { LandingShell } from "@/components/landing/landing-shell";
import {
  ContactSection,
  CreatorsView,
} from "@/components/landing/views/home-views";

export const metadata: Metadata = {
  title:
    "Pro tvůrce — promobazar.cz | Propoj profil, nastav balíčky, získej placené nabídky",
  description:
    "Pro influencery a UGC tvůrce. Propoj sociální sítě, nastav ceny a balíčky a dostávej poptávky od značek.",
};

export default function ProTvurcePage() {
  return (
    <LandingShell>
      <CreatorsView />
      <FaqSection />
      <ContactSection />
    </LandingShell>
  );
}

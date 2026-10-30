import type { Metadata } from "next";

import { CreatorsPage } from "@/components/pages/creators/creators-page";
import { ContactSection } from "@/components/pages/contact-section";
import { CREATOR_FAQ_ITEMS, FaqSection } from "@/components/pages/faq-section";
import { SiteShell } from "@/components/shared/site-shell";

export const metadata: Metadata = {
  title: "Pro tvůrce",
  description:
    "Tvoje videa prodávají. Dej je na tržiště s balíčky a cenou, objednávky a úschova běží na promobazaru. Registrace zdarma.",
};

export default function ProTvurcePage() {
  return (
    <SiteShell>
      <CreatorsPage />
      <FaqSection items={CREATOR_FAQ_ITEMS} />
      <ContactSection />
    </SiteShell>
  );
}

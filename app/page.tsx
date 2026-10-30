import { ContactSection } from "@/components/pages/contact-section";
import { FirmsPage } from "@/components/pages/firms/firms-page";
import { SiteShell } from "@/components/shared/site-shell";

export default function HomePage() {
  return (
    <SiteShell>
      <FirmsPage />
      <ContactSection />
    </SiteShell>
  );
}

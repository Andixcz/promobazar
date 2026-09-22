import { LandingShell } from "@/components/landing/landing-shell";
import {
  ContactSection,
  FirmsView,
} from "@/components/landing/views/home-views";

export default function HomePage() {
  return (
    <LandingShell>
      <FirmsView />
      <ContactSection />
    </LandingShell>
  );
}

import { AppModal } from "@/components/landing/app-modal";
import { ChatWidget } from "@/components/landing/chat-widget";
import { ClientAppScript } from "@/components/landing/client-app-script";
import { CookieBanner } from "@/components/landing/cookie-banner";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import {
  ContactSection,
  CreatorsView,
  FirmsView,
} from "@/components/landing/views/home-views";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <FirmsView />
      <CreatorsView />
      <ContactSection />
      <SiteFooter />
      <AppModal />
      <CookieBanner />
      <ChatWidget />
      <ClientAppScript />
    </>
  );
}

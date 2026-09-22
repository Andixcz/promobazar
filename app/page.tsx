import { AppModal } from "@/components/landing/app-modal";
import { ChatWidget } from "@/components/landing/chat-widget";
import { CookieBanner } from "@/components/landing/cookie-banner";
import { FirmsHeroSection } from "@/components/landing/firms-hero-section";
import { ClientAppScript } from "@/components/landing/client-app-script";
import { StaticHtmlChunk } from "@/components/landing/static-html-chunk";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { getSiteBodyParts } from "@/lib/site-body";

export default function HomePage() {
  const { firmsMainOpen, bodyTailHtml } = getSiteBodyParts();

  return (
    <>
      <SiteHeader />
      <StaticHtmlChunk html={firmsMainOpen} />
      <FirmsHeroSection />
      <StaticHtmlChunk html={bodyTailHtml} />
      <SiteFooter />
      <AppModal />
      <CookieBanner />
      <ChatWidget />
      <ClientAppScript />
    </>
  );
}

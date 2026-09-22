import { AppModal } from "@/components/landing/app-modal";
import { ChatWidget } from "@/components/landing/chat-widget";
import { CookieBanner } from "@/components/landing/cookie-banner";
import { FirmsHeroSection } from "@/components/landing/firms-hero-section";
import { LegacyAppBootstrap } from "@/components/landing/legacy-app-bootstrap";
import { LegacyHtmlChunk } from "@/components/landing/legacy-html-chunk";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { getLegacyBodyParts } from "@/lib/legacy-body";

export default function HomePage() {
  const { firmsMainOpen, legacyTailHtml } = getLegacyBodyParts();

  return (
    <>
      <SiteHeader />
      <LegacyHtmlChunk html={firmsMainOpen} />
      <FirmsHeroSection />
      <LegacyHtmlChunk html={legacyTailHtml} />
      <SiteFooter />
      <AppModal />
      <CookieBanner />
      <ChatWidget />
      <LegacyAppBootstrap />
    </>
  );
}

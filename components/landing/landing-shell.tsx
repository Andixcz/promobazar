import type { ReactNode } from "react";

import { AppModal } from "@/components/landing/app-modal";
import { ChatWidget } from "@/components/landing/chat-widget";
import { ClientAppScript } from "@/components/landing/client-app-script";
import { LandingHashScroll } from "@/components/landing/landing-hash-scroll";
import { CookieBanner } from "@/components/landing/cookie-banner";
import { CookieSettingsDialog } from "@/components/landing/cookie-settings-dialog";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

/** Sdílený obal landing stránek (header, footer, interaktivní logika z app.js). */
export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <LandingHashScroll />
      <AppModal />
      <CookieBanner />
      <CookieSettingsDialog />
      <ChatWidget />
      <ClientAppScript />
    </>
  );
}

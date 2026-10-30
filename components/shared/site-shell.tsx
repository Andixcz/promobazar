import type { ReactNode } from "react";

import { CookieBanner } from "@/components/shared/cookie-banner";
import { CookieSettingsDialog } from "@/components/shared/cookie-settings-dialog";
import { HashScroll } from "@/components/shared/hash-scroll";
import { MemberProvider } from "@/components/shared/member-context";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

/** Sdílený obal marketingových a auth stránek (header, footer, session, cookies). */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <MemberProvider>
      <SiteHeader />
      {children}
      <SiteFooter />
      <HashScroll />
      <CookieBanner />
      <CookieSettingsDialog />
    </MemberProvider>
  );
}

/** @deprecated Prefer `SiteShell` — alias kvůli starším importům. */
export const LandingShell = SiteShell;

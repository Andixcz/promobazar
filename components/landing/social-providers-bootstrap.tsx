"use client";

import { useEffect } from "react";

import type { SocialAuthProviderId } from "@/lib/auth-social";

declare global {
  interface Window {
    __PB_SOCIAL_PROVIDERS__?: SocialAuthProviderId[];
  }
}

/** Doplní OAuth tlačítka v `app.js` podle aktuálních server env (Doppler). */
export function SocialProvidersBootstrap() {
  useEffect(() => {
    fetch("/api/auth/social-providers", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { providers: [] }))
      .then((data: { providers?: SocialAuthProviderId[] }) => {
        if (Array.isArray(data.providers)) {
          window.__PB_SOCIAL_PROVIDERS__ = data.providers;
        }
      })
      .catch(() => {});
  }, []);

  return null;
}

"use client";

import { useEffect, useState } from "react";

import type { SocialAuthProviderId } from "@/lib/auth-social";

/** Runtime seznam OAuth providerů (Doppler env není vždy dostupný při buildu). */
export function useSocialAuthProviders(
  initial?: SocialAuthProviderId[],
): SocialAuthProviderId[] {
  const [providers, setProviders] = useState<SocialAuthProviderId[]>(
    initial ?? [],
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/social-providers", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { providers: [] }))
      .then((data: { providers?: SocialAuthProviderId[] }) => {
        if (!cancelled && Array.isArray(data.providers)) {
          setProviders(data.providers);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return providers;
}

"use client";

import { createClient } from "@supabase/supabase-js";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    supabase?: { createClient: typeof createClient };
  }
}

/** Načte legacy-app.js a vystaví Supabase pro starý skript. */
export function LegacyAppBootstrap() {
  useEffect(() => {
    window.supabase = { createClient };
  }, []);

  return <Script src="/legacy-app.js" strategy="afterInteractive" />;
}

"use client";

import { createClient } from "@supabase/supabase-js";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    supabase?: { createClient: typeof createClient };
  }
}

export function ClientAppScript() {
  useEffect(() => {
    window.supabase = { createClient };
  }, []);

  return <Script src="/app.js" strategy="afterInteractive" />;
}

"use client";

import { CookieIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  getCookieConsent,
  openCookieSettingsDialog,
  setCookieConsent,
} from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!getCookieConsent());
    const onChange = () => setVisible(!getCookieConsent());
    window.addEventListener("pb-cookie-consent-changed", onChange);
    return () => window.removeEventListener("pb-cookie-consent-changed", onChange);
  }, []);

  function dismiss(choice: "essential" | "all") {
    setCookieConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      id="cookie-banner"
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 p-4 transition-all duration-500",
      )}
    >
      <Alert className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-md border border-white/[0.09] bg-panel p-5 backdrop-blur-none has-data-[slot=alert-action]:pr-5 md:flex-row md:items-center">
        <AlertDescription className="flex flex-1 items-start gap-2 text-center md:text-left">
          <CookieIcon className="mt-0.5 size-4 shrink-0 text-mist" aria-hidden />
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span>
              Tento web používá cookies ke zlepšení zážitku a analýze návštěvnosti.
              Obchodní podmínky připravujeme.
            </span>
            <button
              type="button"
              className="text-sm text-zinc-200 underline underline-offset-2 transition-colors hover:text-foreground"
              onClick={() => openCookieSettingsDialog()}
            >
              Nastavení
            </button>
          </div>
        </AlertDescription>
        <AlertAction className="static md:justify-end">
          <Button type="button" variant="outline" size="sm" onClick={() => dismiss("essential")}>
            Jen nezbytné
          </Button>
          <Button type="button" variant="default" size="sm" onClick={() => dismiss("all")}>
            Přijmout vše
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}

"use client";

import { CookieIcon } from "lucide-react";

import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { invokeAppGlobal } from "@/lib/app-global";

export function CookieBanner() {
  return (
    <div id="cookie-banner" className="fixed bottom-0 inset-x-0 z-50 p-4">
      <Alert
        className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-md border border-white/[0.09] bg-panel p-5 backdrop-blur-none md:flex-row md:p-6"
      >
        <AlertDescription className="flex flex-1 items-start gap-2 text-center md:text-left">
          <CookieIcon className="mt-0.5 size-4 shrink-0 text-mist" aria-hidden />
          <span>
            Tento web používá cookies ke zlepšení zážitku a analýze návštěvnosti.
            Obchodní podmínky připravujeme.
          </span>
        </AlertDescription>
        <AlertAction className="static md:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => invokeAppGlobal("cookieChoice", "essential")}
          >
            Jen nezbytné
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => invokeAppGlobal("openCookieSettings")}
          >
            Nastavení
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => invokeAppGlobal("cookieChoice", "all")}
          >
            Přijmout vše
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}

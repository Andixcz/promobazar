"use client";

import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  COOKIE_SETTINGS_OPEN_EVENT,
  setCookieConsent,
} from "@/lib/cookie-consent";
import { glassPanel, htmlButtonCta } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

function CookieToggleRow({
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-md border p-4 transition-colors",
        disabled
          ? "border-white/[0.09] bg-white/[0.02]"
          : "border-white/[0.09] bg-panel hover:border-white/[0.14]"
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-mist">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40",
          checked ? "bg-cyan" : "bg-white/15",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 block size-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

export function CookieSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpen);
  }, []);

  function handleSave() {
    setCookieConsent("custom");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "gap-6 sm:max-w-lg",
          glassPanel,
          "rounded-md border-white/[0.09] !bg-panel bg-none from-transparent to-transparent shadow-none"
        )}
      >
        <div className="flex items-start gap-4 pr-8">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-cyan text-void"
            aria-hidden
          >
            <Cookie className="size-5" />
          </span>
          <DialogHeader className="pr-0">
            <DialogTitle>Nastavení cookies</DialogTitle>
            <DialogDescription>
              Vyber, co nám můžeš pomoct měřit. Nezbytné cookies jsou vždy zapnuté, aby web
              fungoval.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-3">
          <CookieToggleRow
            title="Nezbytné cookies"
            description="Zajišťují přihlášení, bezpečnost a základní funkce webu."
            checked
            disabled
          />
          <CookieToggleRow
            title="Analytické cookies"
            description="Anonymní statistiky návštěvnosti. Pomáhají nám web zlepšovat."
            checked={analytics}
            onCheckedChange={setAnalytics}
          />
          <CookieToggleRow
            title="Marketingové cookies"
            description="Personalizovaná nabídka a měření kampaní mimo web."
            checked={marketing}
            onCheckedChange={setMarketing}
          />
        </div>

        <DialogFooter className="border-none pt-0 sm:justify-stretch">
          <Button type="button" className={cn(htmlButtonCta, "w-full")} onClick={handleSave}>
            Uložit nastavení
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

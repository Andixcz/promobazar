"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";

import { checkoutPublicPackage } from "@/app/marketplace/checkout-actions";
import { OrderBriefAttachmentsField } from "@/components/marketplace/order-brief-attachments-field";
import { PackageOrderSummary } from "@/components/marketplace/package-order-summary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AUTH_LOGIN_PATH } from "@/lib/auth-routes";
import {
  packageOrderPath,
  packagePublicPath,
} from "@/lib/marketplace/public-routes";
import type {
  PublicCreatorProfile,
  PublicPackageRow,
} from "@/lib/marketplace/public-server";
import type { OrderBriefAttachment } from "@/lib/orders/brief-attachments";
import {
  marketplaceGigAside,
  marketplaceGigGrid,
  marketplaceGigMain,
} from "@/lib/marketplace/public-layout";
import {
  ORDER_BRIEF_MAX_LENGTH,
  ORDER_BRIEF_MIN_LENGTH,
  orderCheckoutFormSchema,
  zodFieldError,
} from "@/lib/orders/order-brief-schema";
import { surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

function OrderConsentChecks({ consentError }: { consentError: string | null }) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-white/[0.08] pt-6">
      {consentError ? (
        <Alert variant="destructive" className="px-4 py-3.5">
          <AlertCircle aria-hidden />
          <AlertDescription>{consentError}</AlertDescription>
        </Alert>
      ) : null}
      <Checkbox name="consentTerms" className="w-full">
        Souhlasím s{" "}
        <span
          className="text-mist underline decoration-white/20 underline-offset-2"
          title="Obchodní podmínky připravujeme"
        >
          obchodními podmínkami
        </span>{" "}
        promobazar.cz.
      </Checkbox>
      <Checkbox name="consentMarketplace" className="w-full">
        Beru na vědomí pravidla objednávky: platba přes Stripe, lhůta pro
        přijetí tvůrcem 48 hodin a vrácení platby při ne přijetí.
      </Checkbox>
      <Checkbox name="consentPrivacy" className="w-full">
        Souhlasím se{" "}
        <Link
          href="#"
          className="text-mist underline decoration-white/20 underline-offset-2 hover:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          zpracováním osobních údajů
        </Link>{" "}
        pro vyřízení této objednávky.
      </Checkbox>
    </div>
  );
}

type PackageOrderCheckoutFormProps = {
  creator: PublicCreatorProfile;
  pkg: PublicPackageRow;
};

export function PackageOrderCheckoutForm({
  creator,
  pkg,
}: PackageOrderCheckoutFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [brief, setBrief] = useState("");
  const [briefError, setBriefError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<OrderBriefAttachment[]>([]);

  const gigHref = packagePublicPath(creator.slug, pkg.id);
  const orderHref = packageOrderPath(creator.slug, pkg.id);

  const trimmedBriefLength = brief.trim().length;
  const briefCountTone =
    trimmedBriefLength > ORDER_BRIEF_MAX_LENGTH
      ? "text-destructive"
      : "text-mist";

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBriefError(null);
    setConsentError(null);
    setFormError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      brief: String(formData.get("brief") ?? ""),
      consentTerms: formData.get("consentTerms") === "on",
      consentMarketplace: formData.get("consentMarketplace") === "on",
      consentPrivacy: formData.get("consentPrivacy") === "on",
    };

    const parsed = orderCheckoutFormSchema.safeParse(payload);
    if (!parsed.success) {
      const briefMessage = zodFieldError(parsed.error, "brief");
      if (briefMessage) {
        setBriefError(briefMessage);
        document.getElementById("order-brief")?.focus();
        return;
      }
      const consentMessage =
        zodFieldError(parsed.error, "consentTerms") ??
        zodFieldError(parsed.error, "consentMarketplace") ??
        zodFieldError(parsed.error, "consentPrivacy");
      if (consentMessage) {
        setConsentError(consentMessage);
      }
      return;
    }

    startTransition(async () => {
      const result = await checkoutPublicPackage({
        packageId: pkg.id,
        brief: parsed.data.brief,
        briefAttachments: attachments,
      });
      if (!result.ok) {
        if ("code" in result && result.code === "auth") {
          router.push(
            `${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent(orderHref)}`,
          );
          return;
        }
        setFormError(result.error);
        return;
      }
      window.location.assign(result.url);
    });
  }

  const summaryProps = {
    name: pkg.name,
    priceCzk: pkg.priceCzk,
    deliveryDays: pkg.deliveryDays,
    revisions: pkg.revisions,
    format: pkg.format,
    licenseDays: pkg.licenseDays,
  };

  return (
    <form
      className={marketplaceGigGrid}
      onSubmit={onSubmit}
      noValidate
    >
      <div className={marketplaceGigMain}>
        <div className={cn(surface, "w-full min-w-0 p-0")}>
          <header className="space-y-2 border-b border-white/[0.08] px-5 py-5 md:px-6">
            <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Zadání pro tvůrce
            </h1>
            <p className="text-sm leading-relaxed text-zinc-200">
              Popiš, co má práce obsahovat a jak si přeješ, že to má být hotové.
              Nahraj také inspirativní obrázky nebo videa pro daného tvůrce pro
              větší pomoc.
            </p>
          </header>

          <div className="flex w-full min-w-0 flex-col gap-4 p-5 md:p-6">
            <div className="w-full min-w-0">
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <Label htmlFor="order-brief">Brief pro tvůrce</Label>
                <span
                  className={cn(
                    "text-[11px] tabular-nums",
                    briefCountTone,
                  )}
                >
                  {trimmedBriefLength}/{ORDER_BRIEF_MAX_LENGTH}
                </span>
              </div>
              <p className="-mt-0.5 mb-2 text-xs leading-relaxed text-mist">
                Produkt, cílovka, CTA, odkazy na materiály, tón komunikace. Min.
                {" "}
                {ORDER_BRIEF_MIN_LENGTH} znaků.
              </p>
              <Textarea
                id="order-brief"
                name="brief"
                rows={12}
                value={brief}
                maxLength={ORDER_BRIEF_MAX_LENGTH}
                aria-invalid={briefError ? true : undefined}
                placeholder="Např. UGC video na TikTok pro launch krému, důraz na hydrataci, CTA „link v bio“, dodání do 14 dnů…"
                className={cn(
                  "min-h-[16rem] w-full resize-y text-sm leading-relaxed",
                  briefError &&
                    "border-destructive/50 ring-2 ring-destructive/35",
                )}
                onChange={(event) => {
                  setBrief(event.target.value);
                  if (briefError) setBriefError(null);
                }}
              />
              {briefError ? (
                <Alert variant="destructive" className="mt-3 px-4 py-3.5">
                  <AlertCircle aria-hidden />
                  <AlertDescription>{briefError}</AlertDescription>
                </Alert>
              ) : null}
            </div>

            <OrderBriefAttachmentsField
              value={attachments}
              onChange={setAttachments}
              disabled={pending}
            />

            {formError ? (
              <Alert variant="destructive" className="px-4 py-3.5">
                <AlertCircle aria-hidden />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <OrderConsentChecks consentError={consentError} />
          </div>
        </div>
      </div>

      <aside className={marketplaceGigAside}>
        <PackageOrderSummary
          {...summaryProps}
          className="h-full w-full"
          footer={
            <div className="space-y-3">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={pending}
              >
                {pending ? "Přesměrovávám na platbu…" : "Pokračovat v platbě"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                asChild
              >
                <Link href={gigHref}>Zpět na balíček</Link>
              </Button>
              <p className="flex items-start gap-2 text-[11px] leading-relaxed text-mist">
                <ShieldCheck
                  className="mt-0.5 size-3.5 shrink-0 text-cyan/80"
                  aria-hidden
                />
                Platba bude provedena přes Stripe. Tvůrce má na přijetí 48
                hodin, poté je platba vrácena na stejný účet.
              </p>
            </div>
          }
        />
      </aside>
    </form>
  );
}

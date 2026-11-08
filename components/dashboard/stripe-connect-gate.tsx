"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { DASHBOARD_HOME_PATH } from "@/lib/dashboard-routes";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { modalScrim, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

const STRIPE_CONNECT_HREF = "/api/stripe/connect";

function subscribeToMounted() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function StripeConnectGate({
  stripeTransfersStatus,
}: {
  stripeTransfersStatus: MemberProfileRow["stripeTransfersStatus"];
}) {
  const mounted = useSyncExternalStore(
    subscribeToMounted,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (stripeTransfersStatus === "active") return null;

  const title =
    stripeTransfersStatus === "restricted"
      ? "Dokonči výplatní účet"
      : "Propoj Stripe pro prodej";

  const description =
    stripeTransfersStatus === "restricted"
      ? "Stripe potřebuje doplnit údaje. Bez aktivního výplatního účtu nemůžeš publikovat balíčky ani přijímat platby."
      : "Než začneš prodávat balíčky na tržišti, nastav výplaty přes Stripe. Zákazníci platí kartou, peníze ti po schválení zakázky pošleme na účet.";

  const cta = stripeTransfersStatus
    ? "Dokončit ve Stripe"
    : "Založit výplaty ve Stripe";

  const gate = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="stripe-connect-gate-title"
      aria-describedby="stripe-connect-gate-desc"
    >
      <div className={cn("absolute inset-0", modalScrim)} aria-hidden />
      <StripeConnectGatePanel title={title} description={description} cta={cta} />
    </div>
  );

  if (!mounted) return null;
  return createPortal(gate, document.body);
}

function StripeConnectGatePanel({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <div
      className={cn(
        surface,
        "relative z-[1] grid w-full max-w-lg gap-4 p-6 text-sm text-foreground sm:p-8",
      )}
    >
      <div className="flex flex-col gap-2 pr-2">
        <h2
          id="stripe-connect-gate-title"
          className="font-display text-xl font-bold leading-tight tracking-tight text-white"
        >
          {title}
        </h2>
        <p id="stripe-connect-gate-desc" className="text-sm leading-relaxed text-zinc-200">
          {description}
        </p>
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link href={DASHBOARD_HOME_PATH}>Zpět na přehled</Link>
        </Button>
        <Button type="button" size="sm" asChild>
          <a href={STRIPE_CONNECT_HREF}>{cta}</a>
        </Button>
      </div>
    </div>
  );
}

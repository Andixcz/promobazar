"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";

export function StripeConnectRequiredModal({
  stripeTransfersStatus,
}: {
  stripeTransfersStatus: MemberProfileRow["stripeTransfersStatus"];
}) {
  const needsConnect = stripeTransfersStatus !== "active";
  const title =
    stripeTransfersStatus === "restricted"
      ? "Dokonči výplatní účet"
      : "Propoj Stripe pro prodej";

  const description =
    stripeTransfersStatus === "restricted"
      ? "Stripe potřebuje doplnit údaje. Bez aktivního výplatního účtu nemůžeš publikovat balíčky ani přijímat platby."
      : "Než začneš prodávat balíčky na tržišti, nastav výplaty přes Stripe. Zákazníci platí kartou, peníze ti po schválení zakázky pošleme na účet.";

  return (
    <Modal
      open={needsConnect}
      onOpenChange={() => {}}
      dismissible={false}
      showCloseButton={false}
      title={title}
      description={description}
      footer={
        <>
          <Button type="button" variant="ghost" asChild>
            <Link href="/dashboard">Zpět na přehled</Link>
          </Button>
          <Link href="/api/stripe/connect" className={buttonVariants({ size: "sm" })}>
            {stripeTransfersStatus ? "Dokončit ve Stripe" : "Založit výplaty ve Stripe"}
          </Link>
        </>
      }
    />
  );
}

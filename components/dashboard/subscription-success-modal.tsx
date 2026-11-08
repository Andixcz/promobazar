"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { IllustrationIcon } from "@/components/ui/illustration-icon";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  subscriptionPlanIds,
  type SubscriptionPlanId,
} from "@/lib/billing/plans";
import { subscriptionSuccessContent } from "@/lib/billing/subscription-success-copy";

function parsePlan(value: string | null): SubscriptionPlanId | null {
  if (!value) return null;
  return subscriptionPlanIds.includes(value as SubscriptionPlanId)
    ? (value as SubscriptionPlanId)
    : null;
}

export function SubscriptionSuccessModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const show = searchParams.get("predplatne") === "ok";
  const plan = parsePlan(searchParams.get("plan"));
  const [open, setOpen] = useState(show);

  useEffect(() => {
    setOpen(show);
    if (show) {
      router.refresh();
      const retry = window.setTimeout(() => router.refresh(), 2500);
      return () => window.clearTimeout(retry);
    }
  }, [show, router]);

  if (!show) return null;

  const content = subscriptionSuccessContent(plan);

  function clearQuery() {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("predplatne");
    next.delete("plan");
    next.delete("session_id");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) clearQuery();
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      contentClassName="sm:max-w-md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
          >
            Zavřít
          </Button>
          <Button type="button" size="sm" asChild>
            <Link href={content.ctaHref} onClick={() => handleOpenChange(false)}>
              {content.ctaLabel}
            </Link>
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-3 pt-1 text-center">
        <IllustrationIcon
          name="Checkmark"
          className="h-11 w-auto text-cyan"
          aria-hidden
        />
        <h2 className="font-display text-lg font-semibold tracking-tight text-white md:text-xl">
          {content.title}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-300">
          {content.description}
        </p>
      </div>
    </Modal>
  );
}

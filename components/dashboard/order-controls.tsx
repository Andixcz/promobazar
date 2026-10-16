"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  acceptMarketplaceOrder,
  approveMarketplaceOrder,
  deliverMarketplaceOrder,
  payPendingOrder,
  rejectMarketplaceOrder,
  requestMarketplaceRevision,
} from "@/app/dashboard/order-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DashboardOrderListItem } from "@/lib/dashboard/orders-server";

export function OrderControls({ order }: { order: DashboardOrderListItem }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState(order.deliverableUrl ?? "");

  function run(action: () => Promise<{ ok: boolean; error?: string; url?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? "Akce se nepovedla.");
        router.refresh();
        return;
      }
      if (result.url) {
        window.location.assign(result.url);
        return;
      }
      router.refresh();
    });
  }

  const creator = order.viewerRole === "creator";
  const canRevise = order.revisionCount < order.revisionsAllowed;

  const needsLink =
    creator &&
    (order.status === "in_progress" || order.status === "revision_requested");

  const hasAction =
    needsLink ||
    (creator && order.status === "awaiting_acceptance") ||
    (!creator &&
      (order.status === "pending_payment" || order.status === "delivered"));
  if (!hasAction && !error) return null;

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      {needsLink ? (
        <form
          className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => deliverMarketplaceOrder(order.id, deliverableUrl));
          }}
        >
          <Input
            value={deliverableUrl}
            onChange={(event) => setDeliverableUrl(event.target.value)}
            placeholder="Odkaz na výstup"
            required
            type="url"
            className="sm:w-64"
          />
          <Button type="submit" size="sm" disabled={pending}>
            Odevzdat
          </Button>
        </form>
      ) : null}

      {creator && order.status === "awaiting_acceptance" ? (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => run(() => acceptMarketplaceOrder(order.id))}
          >
            Přijmout
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => run(() => rejectMarketplaceOrder(order.id))}
          >
            Odmítnout
          </Button>
        </div>
      ) : null}

      {!creator && order.status === "pending_payment" ? (
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() => run(() => payPendingOrder(order.id))}
        >
          Zaplatit
        </Button>
      ) : null}

      {!creator && order.status === "delivered" ? (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => run(() => approveMarketplaceOrder(order.id))}
          >
            Schválit
          </Button>
          {canRevise ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => run(() => requestMarketplaceRevision(order.id))}
            >
              Požádat o úpravu
            </Button>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-error-soft" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

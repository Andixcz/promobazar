import { Receipt } from "lucide-react";

import { OrderControls } from "@/components/dashboard/order-controls";
import type { DashboardOrderListItem } from "@/lib/dashboard/orders-server";
import {
  orderStatusHint,
  orderStatusLabel,
} from "@/lib/dashboard/marketplace-order";
import type { MemberRole } from "@/lib/db/schema";
import { emptyState, emptyStateIcon, resultCount, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

function formatOrderDate(value: Date) {
  return value.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDeadline(value: Date) {
  return value.toLocaleString("cs-CZ", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCzk(amount: number) {
  return `${amount.toLocaleString("cs-CZ")} Kč`;
}

function deadlineLine(order: DashboardOrderListItem) {
  if (order.status === "awaiting_acceptance" && order.acceptBy) {
    return `Přijetí do ${formatDeadline(order.acceptBy)}`;
  }
  if (order.status === "in_progress" && order.deliveryDueAt) {
    return `Doručit do ${formatDeadline(order.deliveryDueAt)}`;
  }
  if (order.status === "delivered" && order.reviewDueAt) {
    return `Schválit do ${formatDeadline(order.reviewDueAt)}`;
  }
  return null;
}

function shownAmount(order: DashboardOrderListItem) {
  const paid =
    order.status !== "pending_payment" &&
    order.status !== "refunded" &&
    order.status !== "cancelled";
  if (order.viewerRole === "creator" && paid) return order.payoutCzk;
  return order.amountCzk;
}

function counterpartyLabel(
  order: DashboardOrderListItem,
  viewerMemberRole: MemberRole,
) {
  if (order.viewerRole === "creator") {
    return `Zákazník: ${order.clientName}`;
  }
  return `Tvůrce: ${order.creatorName}`;
}

function emptyCopy(role: MemberRole) {
  switch (role) {
    case "creator":
      return {
        title: "Zatím nemáš žádné objednávky",
        body:
          "Až si značka nebo nakupující objedná balíček, uvidíš tady stav práce a platby.",
      };
    case "brand":
      return {
        title: "Zatím nemáš žádné objednávky",
        body:
          "Objednávky z tržiště a poptávek se zobrazí tady. Uvidíš, na čem tvůrce pracuje.",
      };
    case "buyer":
      return {
        title: "Zatím nemáš žádné objednávky",
        body:
          "Po objednání balíčku u tvůrce sleduješ průběh a schvalování obsahu na jednom místě.",
      };
  }
}

type OrdersPanelProps = {
  orders: DashboardOrderListItem[];
  memberRole: MemberRole;
};

export function OrdersPanel({ orders, memberRole }: OrdersPanelProps) {
  const empty = emptyCopy(memberRole);

  return (
    <div className="space-y-0">
      <span className={resultCount}>
        {orders.length === 0
          ? "Žádné objednávky"
          : `${orders.length} ${orders.length === 1 ? "objednávka" : "objednávek"}`}
      </span>

      <div className={cn(surface, "mt-5 overflow-hidden")}>
        {orders.length === 0 ? (
          <div className={emptyState}>
            <div className={emptyStateIcon}>
              <Receipt className="size-5" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="font-display text-base font-semibold text-white">
              {empty.title}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
              {empty.body}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.08]">
            {orders.map((order) => (
              <li key={order.id} className="space-y-3 px-5 py-4 md:px-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="font-display text-base font-semibold text-white">
                      {order.title}
                    </p>
                    <p className="text-sm text-mist">
                      {counterpartyLabel(order, memberRole)}
                    </p>
                    <p className="text-xs text-mist">
                      {deadlineLine(order) ??
                        `${orderStatusHint(order.status, order.viewerRole)}, ${formatOrderDate(order.createdAt)}`}
                    </p>
                    {order.brief ? (
                      <p className="line-clamp-2 text-sm text-zinc-300">{order.brief}</p>
                    ) : null}
                    {order.deliverableUrl && order.status !== "in_progress" ? (
                      <a
                        href={order.deliverableUrl}
                        className="text-sm text-cyan underline-offset-2 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Výstup
                      </a>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-1 md:items-end">
                    <span className="rounded-sm border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-xs font-medium text-cyan">
                      {orderStatusLabel(order.status)}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-white">
                      {formatCzk(shownAmount(order))}
                    </span>
                    {order.viewerRole === "creator" && shownAmount(order) !== order.amountCzk ? (
                      <span className="text-xs text-mist">po provizi</span>
                    ) : null}
                  </div>
                </div>
                <OrderControls order={order} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { Receipt } from "lucide-react";

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

function formatCzk(amount: number) {
  return `${amount.toLocaleString("cs-CZ")} Kč`;
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
              <li
                key={order.id}
                className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-start md:justify-between md:px-6"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-display text-base font-semibold text-white">
                    {order.title}
                  </p>
                  <p className="text-sm text-mist">
                    {counterpartyLabel(order, memberRole)}
                  </p>
                  <p className="text-xs text-mist">
                    Založeno {formatOrderDate(order.createdAt)}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {orderStatusHint(order.status)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-1 md:items-end">
                  <span
                    className="rounded-sm border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-xs font-medium text-cyan"
                  >
                    {orderStatusLabel(order.status)}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-white">
                    {formatCzk(order.amountCzk)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

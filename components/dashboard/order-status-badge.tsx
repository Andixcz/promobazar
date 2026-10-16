import {
  orderStatusLabel,
  type MarketplaceOrderStatus,
} from "@/lib/dashboard/marketplace-order";
import { cn } from "@/lib/utils";

function tone(status: MarketplaceOrderStatus) {
  switch (status) {
    case "completed":
      return "border-white/[0.14] bg-white/[0.06] text-white/85";
    case "refunded":
    case "cancelled":
      return "border-white/[0.09] bg-white/[0.03] text-mist";
    case "disputed":
      return "border-error-soft/30 bg-error-soft/10 text-error-soft";
    default:
      return "border-cyan/30 bg-cyan/10 text-cyan";
  }
}

export function OrderStatusBadge({ status }: { status: MarketplaceOrderStatus }) {
  return (
    <span
      className={cn(
        "rounded-sm border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        tone(status),
      )}
    >
      {orderStatusLabel(status)}
    </span>
  );
}

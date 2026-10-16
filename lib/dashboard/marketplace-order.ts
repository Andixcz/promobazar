import type { MarketplaceOrderStatus } from "@/lib/db/schema";

export type { MarketplaceOrderStatus };

export function orderStatusLabel(status: MarketplaceOrderStatus): string {
  switch (status) {
    case "pending_payment":
      return "Čeká na platbu";
    case "awaiting_acceptance":
      return "Čeká na přijetí";
    case "in_progress":
      return "Tvorba";
    case "delivered":
      return "Ke schválení";
    case "revision_requested":
      return "Úprava";
    case "payout_pending":
      return "K výplatě";
    case "completed":
      return "Vyplaceno";
    case "refunded":
      return "Vráceno";
    case "cancelled":
      return "Zrušeno";
    case "disputed":
      return "Reklamace";
  }
}

export function orderStatusHint(
  status: MarketplaceOrderStatus,
  viewerRole: "creator" | "client",
): string {
  switch (status) {
    case "pending_payment":
      return viewerRole === "client" ? "Čeká na tvoji platbu." : "Čeká na platbu zákazníka.";
    case "awaiting_acceptance":
      return viewerRole === "creator" ? "Přijmi, nebo odmítni." : "Čeká se na přijetí.";
    case "in_progress":
      return "Tvůrce na zakázce pracuje.";
    case "delivered":
      return viewerRole === "client" ? "Zkontroluj výstup." : "Čeká na schválení.";
    case "revision_requested":
      return viewerRole === "creator" ? "Pošli upravený odkaz." : "Čeká se na úpravu.";
    case "payout_pending":
      return "Výplata se připravuje.";
    case "completed":
      return "Hotovo.";
    case "refunded":
      return "Platba se vrátila.";
    case "cancelled":
      return "Objednávka je zrušená.";
    case "disputed":
      return "Řeší se reklamace.";
  }
}

export function isActiveOrderStatus(status: MarketplaceOrderStatus): boolean {
  return (
    status === "pending_payment" ||
    status === "awaiting_acceptance" ||
    status === "in_progress" ||
    status === "delivered" ||
    status === "revision_requested" ||
    status === "payout_pending" ||
    status === "disputed"
  );
}

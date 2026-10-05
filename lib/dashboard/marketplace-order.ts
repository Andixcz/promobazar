export const marketplaceOrderStatusValues = [
  "pending_payment",
  "paid",
  "in_progress",
  "delivered",
  "completed",
  "cancelled",
  "disputed",
] as const;

export type MarketplaceOrderStatus =
  (typeof marketplaceOrderStatusValues)[number];

export function orderStatusLabel(status: MarketplaceOrderStatus): string {
  switch (status) {
    case "pending_payment":
      return "Čeká na platbu";
    case "paid":
      return "Zaplaceno";
    case "in_progress":
      return "Probíhá";
    case "delivered":
      return "Ke schválení";
    case "completed":
      return "Dokončeno";
    case "cancelled":
      return "Zrušeno";
    case "disputed":
      return "Reklamace";
  }
}

export function orderStatusHint(status: MarketplaceOrderStatus): string {
  switch (status) {
    case "pending_payment":
      return "Dokonči platbu, aby tvůrce mohl začít.";
    case "paid":
      return "Platba proběhla, čeká se na zahájení práce.";
    case "in_progress":
      return "Tvůrce na zakázce pracuje.";
    case "delivered":
      return "Obsah je hotový. Zkontroluj ho a schval.";
    case "completed":
      return "Spolupráce je uzavřená.";
    case "cancelled":
      return "Objednávka byla zrušena.";
    case "disputed":
      return "Řešíme reklamaci podle pravidel tržiště.";
  }
}

export function isActiveOrderStatus(status: MarketplaceOrderStatus): boolean {
  return (
    status === "pending_payment" ||
    status === "paid" ||
    status === "in_progress" ||
    status === "delivered" ||
    status === "disputed"
  );
}

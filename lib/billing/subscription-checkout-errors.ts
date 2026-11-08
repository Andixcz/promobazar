import {
  subscriptionPlanDeniedMessage,
  type SubscriptionPlanId,
} from "@/lib/billing/plans";

export const SUBSCRIPTION_CHECKOUT_ERROR_PATH = "/predplatne/chyba";

export const subscriptionCheckoutErrorReasons = [
  "wrong_role",
  "active_plan",
] as const;
export type SubscriptionCheckoutErrorReason =
  (typeof subscriptionCheckoutErrorReasons)[number];

export function subscriptionCheckoutErrorHref(input: {
  plan?: SubscriptionPlanId | null;
  msg: string;
  reason?: SubscriptionCheckoutErrorReason;
}): string {
  const params = new URLSearchParams();
  params.set("msg", input.msg);
  if (input.plan) params.set("plan", input.plan);
  if (input.reason) params.set("reason", input.reason);
  return `${SUBSCRIPTION_CHECKOUT_ERROR_PATH}?${params.toString()}`;
}

export function checkoutBlockReasonForMessage(
  plan: SubscriptionPlanId,
  message: string,
): SubscriptionCheckoutErrorReason | undefined {
  if (message === subscriptionPlanDeniedMessage(plan)) return "wrong_role";
  if (message === "Tenhle plán už máš aktivní.") return "active_plan";
  return undefined;
}

export const checkoutErrorCopy = {
  dbSchema:
    "Platbu teď nejde spustit. Služba není připravená. Zkus to za chvíli, nebo napiš na kontakt.",
  stripeConfig: "Platby nejsou na serveru dostupné. Zkus to později.",
  generic: "Checkout se nepodařil otevřít. Zkus to znovu.",
} as const;

/** Pro zobrazení v UI: ořízne staré dev hlášky z query. */
export function userFacingCheckoutError(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return checkoutErrorCopy.generic;
  if (
    trimmed.includes("db:migrate") ||
    trimmed.includes("doppler run") ||
    trimmed.includes("billing_plan")
  ) {
    return checkoutErrorCopy.dbSchema;
  }
  if (trimmed.includes("STRIPE_SECRET") || trimmed.includes("webhook secret")) {
    return checkoutErrorCopy.stripeConfig;
  }
  return trimmed;
}

export function messageFromCheckoutFailure(error: unknown): string {
  const text =
    error instanceof Error
      ? `${error.message}${error.cause instanceof Error ? ` ${error.cause.message}` : ""}`
      : "";

  if (text.includes("billing_plan") || text.includes("does not exist")) {
    return checkoutErrorCopy.dbSchema;
  }
  if (text.includes("STRIPE") || text.toLowerCase().includes("stripe")) {
    return checkoutErrorCopy.stripeConfig;
  }
  return checkoutErrorCopy.generic;
}

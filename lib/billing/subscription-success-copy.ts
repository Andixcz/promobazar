import type { SubscriptionPlanId } from "@/lib/billing/plans";
import { dashboardPath } from "@/lib/dashboard-routes";

export type SubscriptionSuccessContent = {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
};

const PLAN_CONTENT: Record<SubscriptionPlanId, SubscriptionSuccessContent> = {
  growth: {
    title: "Growth je aktivní",
    description:
      "Neomezené objednávky a nižší provize u nových zakázek. Fakturaci a kartu spravuješ ve Stripe.",
    ctaHref: dashboardPath(),
    ctaLabel: "Zpět do přehledu",
  },
  creator_pro: {
    title: "Creator PRO je aktivní",
    description:
      "Můžeš publikovat neomezeně balíčků. PRO badge uvidí zákazníci v tržišti.",
    ctaHref: dashboardPath("balicky"),
    ctaLabel: "Na balíčky",
  },
};

const GENERIC: SubscriptionSuccessContent = {
  title: "Předplatné je aktivní",
  description:
    "Stripe potvrdil platbu. Za pár vteřin to uvidíš i v nastavení účtu.",
  ctaHref: dashboardPath("nastaveni"),
  ctaLabel: "Rozumím",
};

export function subscriptionSuccessContent(
  plan: SubscriptionPlanId | null,
): SubscriptionSuccessContent {
  if (plan && PLAN_CONTENT[plan]) return PLAN_CONTENT[plan];
  return GENERIC;
}

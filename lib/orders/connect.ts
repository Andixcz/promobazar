import "server-only";

import { eq } from "drizzle-orm";

import { appPublicBaseUrl } from "@/lib/dashboard/platform-linking-oauth";
import { db } from "@/lib/db";
import { memberProfile } from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";

export type TransfersStatus = "pending" | "active" | "restricted";

function transfersStatus(
  status: string | undefined,
): TransfersStatus {
  if (status === "active") return "active";
  if (
    status === "restricted" ||
    status === "rejected" ||
    status === "unsupported"
  ) {
    return "restricted";
  }
  return "pending";
}

export async function readTransfersStatus(
  accountId: string,
): Promise<TransfersStatus | null> {
  const stripe = getStripe();
  if (!stripe) return null;
  const account = await stripe.v2.core.accounts.retrieve(accountId, {
    include: ["configuration.recipient"],
  });
  return transfersStatus(
    account.configuration?.recipient?.capabilities?.stripe_balance
      ?.stripe_transfers?.status,
  );
}

export async function saveTransfersStatus(
  userId: string,
  accountId: string,
  status: TransfersStatus,
) {
  await db
    .update(memberProfile)
    .set({ stripeAccountId: accountId, stripeTransfersStatus: status })
    .where(eq(memberProfile.userId, userId));
}

export async function ensureRecipientAccount(input: {
  userId: string;
  email: string;
  displayName: string;
  existingAccountId: string | null;
}) {
  const stripe = getStripe();
  if (!stripe) return { ok: false as const, error: "missing_key" as const };

  if (input.existingAccountId) {
    return { ok: true as const, accountId: input.existingAccountId, stripe };
  }

  const account = await stripe.v2.core.accounts.create({
    contact_email: input.email,
    display_name: input.displayName,
    dashboard: "express",
    identity: { country: "cz" },
    defaults: {
      currency: "czk",
      locales: ["cs-CZ"],
      responsibilities: {
        fees_collector: "application",
        losses_collector: "application",
      },
    },
    configuration: {
      recipient: {
        capabilities: {
          stripe_balance: {
            stripe_transfers: { requested: true },
          },
        },
      },
    },
    include: ["configuration.recipient"],
    metadata: { promobazar_user_id: input.userId },
  });

  await saveTransfersStatus(input.userId, account.id, "pending");
  return { ok: true as const, accountId: account.id, stripe };
}

export async function createOnboardingLink(accountId: string) {
  const stripe = getStripe();
  if (!stripe) return null;
  const origin = appPublicBaseUrl();
  const link = await stripe.v2.core.accountLinks.create({
    account: accountId,
    use_case: {
      type: "account_onboarding",
      account_onboarding: {
        refresh_url: `${origin}/api/stripe/connect`,
        return_url: `${origin}/api/stripe/connect/return`,
        collection_options: { fields: "eventually_due" },
      },
    },
  });
  return link.url;
}

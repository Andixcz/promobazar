import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/auth-session";

export async function getAccountAuthContext() {
  const session = await getServerSession();
  if (!session?.user) return null;

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const providers = accounts.map((account) => account.providerId);
  const hasCredential = providers.includes("credential");

  return {
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    hasCredential,
    providers,
  };
}

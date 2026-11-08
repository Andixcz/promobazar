import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/auth-session";

export async function getAccountAuthContext() {
  const session = await getServerSession();
  if (!session?.user) return null;

  let accounts: { id: string; providerId: string }[] = [];
  let hasCredential = false;
  try {
    const listed = await auth.api.listUserAccounts({
      headers: await headers(),
    });
    accounts = listed.map((account) => ({
      id: account.id,
      providerId: account.providerId,
    }));
    hasCredential = accounts.some((account) => account.providerId === "credential");
  } catch {
    hasCredential = true;
  }

  const providers = accounts.map((account) => account.providerId);

  return {
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    hasCredential,
    providers,
    accounts,
  };
}

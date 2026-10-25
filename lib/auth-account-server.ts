import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/auth-session";

export async function getAccountAuthContext() {
  const session = await getServerSession();
  if (!session?.user) return null;

  let providers: string[] = [];
  let hasCredential = false;
  try {
    const accounts = await auth.api.listUserAccounts({
      headers: await headers(),
    });
    providers = accounts.map((account) => account.providerId);
    hasCredential = providers.includes("credential");
  } catch {
    hasCredential = true;
  }

  return {
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    hasCredential,
    providers,
  };
}

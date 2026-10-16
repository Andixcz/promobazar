import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-session";
import { dashboardPath } from "@/lib/dashboard-routes";
import { appPublicBaseUrl } from "@/lib/dashboard/platform-linking-oauth";
import { getProfileByUserId } from "@/lib/dashboard/profile-server";
import {
  createOnboardingLink,
  ensureRecipientAccount,
} from "@/lib/orders/connect";

function settingsRedirect(query: string) {
  const url = new URL(dashboardPath("nastaveni"), appPublicBaseUrl());
  url.searchParams.set("vyplata", query);
  return NextResponse.redirect(url);
}

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    const login = new URL("/prihlaseni", appPublicBaseUrl());
    login.searchParams.set("callbackUrl", "/api/stripe/connect");
    return NextResponse.redirect(login);
  }

  const profile = await getProfileByUserId(session.user.id);
  if (!profile || profile.role !== "creator") {
    return settingsRedirect("jen_tvurce");
  }

  try {
    const account = await ensureRecipientAccount({
      userId: profile.userId,
      email: session.user.email,
      displayName: profile.displayName?.trim() || session.user.name || "Tvůrce",
      existingAccountId: profile.stripeAccountId,
    });
    if (!account.ok) return settingsRedirect("neni_nastavene");

    const url = await createOnboardingLink(account.accountId);
    if (!url) return settingsRedirect("odkaz_selhal");
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("[stripe] connect", error);
    return settingsRedirect("odkaz_selhal");
  }
}

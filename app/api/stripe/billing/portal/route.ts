import { NextResponse } from "next/server";

import { openBillingPortal } from "@/lib/billing/subscription-checkout";
import { getServerSession } from "@/lib/auth-session";
import { AUTH_LOGIN_PATH } from "@/lib/auth-routes";
import { dashboardPath } from "@/lib/dashboard-routes";
import { ensureMemberProfile } from "@/lib/dashboard/profile-server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await getServerSession();
  if (!session?.user) {
    const login = new URL(AUTH_LOGIN_PATH, url.origin);
    login.searchParams.set("callbackUrl", "/api/stripe/billing/portal");
    return NextResponse.redirect(login);
  }

  const profile = await ensureMemberProfile(
    session.user.id,
    session.user.name,
    session.user.email,
  );

  const result = await openBillingPortal(profile);
  if (!result.ok) {
    const back = new URL(dashboardPath("nastaveni"), url.origin);
    back.searchParams.set("predplatne", "chyba");
    back.searchParams.set("msg", result.error);
    return NextResponse.redirect(back);
  }
  return NextResponse.redirect(result.url);
}

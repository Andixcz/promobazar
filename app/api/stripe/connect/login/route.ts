import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-session";
import { dashboardPath } from "@/lib/dashboard-routes";
import { appPublicBaseUrl } from "@/lib/dashboard/platform-linking-oauth";
import { db } from "@/lib/db";
import { memberProfile } from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession();
  const back = new URL(dashboardPath("nastaveni"), appPublicBaseUrl());
  if (!session?.user) {
    back.searchParams.set("vyplata", "neprihlaseno");
    return NextResponse.redirect(back);
  }

  const stripe = getStripe();
  const [profile] = await db
    .select({ stripeAccountId: memberProfile.stripeAccountId })
    .from(memberProfile)
    .where(eq(memberProfile.userId, session.user.id))
    .limit(1);

  if (!stripe || !profile?.stripeAccountId) {
    back.searchParams.set("vyplata", "neni_nastavene");
    return NextResponse.redirect(back);
  }

  try {
    const link = await stripe.accounts.createLoginLink(profile.stripeAccountId);
    return NextResponse.redirect(link.url);
  } catch (error) {
    console.error("[stripe] login link", error);
    back.searchParams.set("vyplata", "odkaz_selhal");
    return NextResponse.redirect(back);
  }
}

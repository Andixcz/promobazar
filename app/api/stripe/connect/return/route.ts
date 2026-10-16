import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-session";
import { dashboardPath } from "@/lib/dashboard-routes";
import { appPublicBaseUrl } from "@/lib/dashboard/platform-linking-oauth";
import { db } from "@/lib/db";
import { memberProfile } from "@/lib/db/schema";
import { readTransfersStatus, saveTransfersStatus } from "@/lib/orders/connect";
import { releasePendingForCreator } from "@/lib/orders/lifecycle";

export async function GET() {
  const session = await getServerSession();
  const url = new URL(dashboardPath("nastaveni"), appPublicBaseUrl());
  if (!session?.user) {
    url.searchParams.set("vyplata", "neprihlaseno");
    return NextResponse.redirect(url);
  }

  const [profile] = await db
    .select({
      userId: memberProfile.userId,
      stripeAccountId: memberProfile.stripeAccountId,
    })
    .from(memberProfile)
    .where(eq(memberProfile.userId, session.user.id))
    .limit(1);

  if (!profile?.stripeAccountId) {
    url.searchParams.set("vyplata", "chybi_ucet");
    return NextResponse.redirect(url);
  }

  const status = await readTransfersStatus(profile.stripeAccountId);
  if (!status) {
    url.searchParams.set("vyplata", "neni_nastavene");
    return NextResponse.redirect(url);
  }

  await saveTransfersStatus(profile.userId, profile.stripeAccountId, status);
  if (status === "active") await releasePendingForCreator(profile.userId);
  url.searchParams.set("vyplata", status);
  return NextResponse.redirect(url);
}

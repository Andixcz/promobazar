import { NextResponse } from "next/server";

import { effectiveBillingPlan } from "@/lib/billing/plans";
import { getServerSession } from "@/lib/auth-session";
import { getProfileByUserId } from "@/lib/dashboard/profile-server";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ plan: null, authenticated: false });
  }

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ plan: null, authenticated: true });
  }

  return NextResponse.json({
    authenticated: true,
    role: profile.role,
    plan: effectiveBillingPlan(profile),
    subscriptionStatus: profile.subscriptionStatus ?? null,
  });
}

import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-session";
import { getProfileByUserId } from "@/lib/dashboard/profile-server";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ role: null });
  }

  const profile = await getProfileByUserId(session.user.id);
  return NextResponse.json({ role: profile?.role ?? null });
}

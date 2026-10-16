import { NextResponse } from "next/server";

import { sweepDeadlines } from "@/lib/orders/lifecycle";

export const runtime = "nodejs";

// ponytail: hodinový cron, lhůty 48 h / 72 h mohou sklouznout až o 60 minut.
// Upgrade: naplánovat job na konkrétní acceptBy / reviewDueAt.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const header = request.headers.get("authorization");
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Neoprávněné." }, { status: 401 });
  }

  await sweepDeadlines();
  return NextResponse.json({ ok: true });
}

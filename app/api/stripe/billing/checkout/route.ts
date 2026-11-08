import { NextResponse } from "next/server";

import { SUBSCRIPTION_CHECKOUT_PATH } from "@/lib/billing/subscription-checkout-url";

export const runtime = "nodejs";

/** Zpětná kompatibilita — přesměruje na `/predplatne`. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const dest = new URL(SUBSCRIPTION_CHECKOUT_PATH, url.origin);
  for (const [key, value] of url.searchParams.entries()) {
    dest.searchParams.set(key, value);
  }
  return NextResponse.redirect(dest, 307);
}

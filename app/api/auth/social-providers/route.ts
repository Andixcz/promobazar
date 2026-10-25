import { NextResponse } from "next/server";

import { listConfiguredSocialAuthProviders } from "@/lib/auth-social-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    providers: listConfiguredSocialAuthProviders(),
  });
}

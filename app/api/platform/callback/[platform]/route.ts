import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  isCreatorPlatformId,
  type CreatorPlatformId,
} from "@/lib/dashboard/creator-platform";
import { upsertCreatorPlatformConnection } from "@/lib/dashboard/platform-linking-connections";
import { exchangePlatformCode } from "@/lib/dashboard/platform-linking-oauth";
import {
  openPlatformOAuthPending,
  PLATFORM_OAUTH_COOKIE,
} from "@/lib/dashboard/platform-oauth-cookie";
import { appPublicBaseUrl } from "@/lib/dashboard/platform-linking-oauth";
import { dashboardPath } from "@/lib/dashboard-routes";

type RouteContext = { params: Promise<{ platform: string }> };

function profileRedirect(query: Record<string, string>) {
  const url = new URL(dashboardPath("profil"), appPublicBaseUrl());
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url);
}

export async function GET(request: Request, context: RouteContext) {
  const { platform: platformParam } = await context.params;
  if (!isCreatorPlatformId(platformParam)) {
    return profileRedirect({ platform_link_error: "neplatna_platforma" });
  }
  const platform = platformParam as CreatorPlatformId;

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const providerError = requestUrl.searchParams.get("error");

  if (providerError || !code || !state) {
    return profileRedirect({ platform_link_error: "zruseno" });
  }

  const cookieStore = await cookies();
  const sealed = cookieStore.get(PLATFORM_OAUTH_COOKIE)?.value;
  cookieStore.delete(PLATFORM_OAUTH_COOKIE);

  const pending = sealed ? openPlatformOAuthPending(sealed) : null;
  if (
    !pending ||
    pending.platform !== platform ||
    pending.state !== state
  ) {
    return profileRedirect({ platform_link_error: "neplatny_stav" });
  }

  try {
    const bundle = await exchangePlatformCode(
      platform,
      code,
      pending.codeVerifier,
    );
    await upsertCreatorPlatformConnection(pending.userId, platform, bundle);
    return profileRedirect({ platform_linked: platform });
  } catch {
    return profileRedirect({ platform_link_error: "propojeni_se_nezdarilo" });
  }
}

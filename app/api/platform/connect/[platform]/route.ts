import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  isCreatorPlatformId,
  type CreatorPlatformId,
} from "@/lib/dashboard/creator-platform";
import { isCreatorPlatformLinkingConfigured } from "@/lib/dashboard/platform-linking-env";
import {
  appPublicBaseUrl,
  buildPlatformAuthorizeUrl,
  createOAuthState,
  createPkcePair,
} from "@/lib/dashboard/platform-linking-oauth";
import {
  PLATFORM_OAUTH_COOKIE,
  PLATFORM_OAUTH_MAX_AGE_SEC,
  sealPlatformOAuthPending,
} from "@/lib/dashboard/platform-oauth-cookie";
import { dashboardPath } from "@/lib/dashboard-routes";
import { getServerSession } from "@/lib/auth-session";

type RouteContext = { params: Promise<{ platform: string }> };

function profileRedirect(query: Record<string, string>) {
  const url = new URL(dashboardPath("profil"), appPublicBaseUrl());
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url);
}

export async function GET(_request: Request, context: RouteContext) {
  const { platform: platformParam } = await context.params;
  if (!isCreatorPlatformId(platformParam)) {
    return profileRedirect({ platform_link_error: "neplatna_platforma" });
  }
  const platform = platformParam as CreatorPlatformId;

  if (!isCreatorPlatformLinkingConfigured(platform)) {
    return profileRedirect({ platform_link_error: "provider_neni_nastaven" });
  }

  const session = await getServerSession();
  if (!session?.user) {
    const login = new URL("/prihlaseni", appPublicBaseUrl());
    login.searchParams.set(
      "callbackUrl",
      `/api/platform/connect/${platform}`,
    );
    return NextResponse.redirect(login);
  }

  const state = createOAuthState();
  let codeVerifier: string | undefined;
  let codeChallenge: string | undefined;
  if (platform === "kick") {
    const pkce = await createPkcePair();
    codeVerifier = pkce.codeVerifier;
    codeChallenge = pkce.codeChallenge;
  }

  const authorizeUrl = buildPlatformAuthorizeUrl(
    platform,
    state,
    codeChallenge,
  );
  if (!authorizeUrl) {
    return profileRedirect({ platform_link_error: "provider_neni_nastaven" });
  }

  const cookieStore = await cookies();
  cookieStore.set(
    PLATFORM_OAUTH_COOKIE,
    sealPlatformOAuthPending({
      platform,
      userId: session.user.id,
      state,
      codeVerifier,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: PLATFORM_OAUTH_MAX_AGE_SEC,
    },
  );

  return NextResponse.redirect(authorizeUrl);
}

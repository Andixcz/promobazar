import "server-only";

import { createHmac } from "node:crypto";

import type { CreatorPlatformId } from "@/lib/dashboard/creator-platform";

export const PLATFORM_OAUTH_COOKIE = "pb_platform_oauth";
export const PLATFORM_OAUTH_MAX_AGE_SEC = 600;

export type PlatformOAuthPending = {
  platform: CreatorPlatformId;
  userId: string;
  state: string;
  codeVerifier?: string;
};

function oauthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("BETTER_AUTH_SECRET is required for platform OAuth.");
  }
  return secret;
}

function signPayload(encoded: string): string {
  return createHmac("sha256", oauthSecret())
    .update(encoded)
    .digest("base64url");
}

export function sealPlatformOAuthPending(pending: PlatformOAuthPending): string {
  const encoded = Buffer.from(JSON.stringify(pending), "utf8").toString(
    "base64url",
  );
  return `${encoded}.${signPayload(encoded)}`;
}

export function openPlatformOAuthPending(
  sealed: string,
): PlatformOAuthPending | null {
  const [encoded, signature] = sealed.split(".");
  if (!encoded || !signature) return null;
  if (signPayload(encoded) !== signature) return null;
  try {
    const json = Buffer.from(encoded, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as PlatformOAuthPending;
    if (!parsed.platform || !parsed.userId || !parsed.state) return null;
    return parsed;
  } catch {
    return null;
  }
}

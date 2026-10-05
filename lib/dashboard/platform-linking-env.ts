import "server-only";

import type { CreatorPlatformId } from "@/lib/dashboard/creator-platform";
import { CREATOR_PLATFORM_IDS } from "@/lib/dashboard/creator-platform";

export type { CreatorPlatformId };

export function platformOAuthCallbackPath(platform: CreatorPlatformId): string {
  return `/api/platform/callback/${platform}`;
}

export function isCreatorPlatformLinkingConfigured(
  platform: CreatorPlatformId,
): boolean {
  return getCreatorPlatformOAuthConfig(platform) !== null;
}

export function listConfiguredCreatorPlatforms(): CreatorPlatformId[] {
  return CREATOR_PLATFORM_IDS.filter(isCreatorPlatformLinkingConfigured);
}

/** Vrátí creds pro server-side OAuth flow; null = provider není nakonfigurovaný. */
export function getCreatorPlatformOAuthConfig(
  platform: CreatorPlatformId,
):
  | { clientId: string; clientSecret: string }
  | { clientKey: string; clientSecret: string }
  | null {
  switch (platform) {
    case "twitch": {
      const clientId = process.env.TWITCH_CLIENT_ID;
      const clientSecret = process.env.TWITCH_CLIENT_SECRET;
      if (!clientId || !clientSecret) return null;
      return { clientId, clientSecret };
    }
    case "kick": {
      const clientId = process.env.KICK_CLIENT_ID;
      const clientSecret = process.env.KICK_CLIENT_SECRET;
      if (!clientId || !clientSecret) return null;
      return { clientId, clientSecret };
    }
    case "tiktok": {
      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
      if (!clientKey || !clientSecret) return null;
      return { clientKey, clientSecret };
    }
    case "instagram": {
      const appId = process.env.META_APP_ID;
      const appSecret = process.env.META_APP_SECRET;
      if (!appId || !appSecret) return null;
      return { clientId: appId, clientSecret: appSecret };
    }
    case "youtube": {
      const clientId =
        process.env.YOUTUBE_CLIENT_ID?.trim() ||
        process.env.GOOGLE_CLIENT_ID?.trim();
      const clientSecret =
        process.env.YOUTUBE_CLIENT_SECRET?.trim() ||
        process.env.GOOGLE_CLIENT_SECRET?.trim();
      if (!clientId || !clientSecret) return null;
      return { clientId, clientSecret };
    }
    default:
      return null;
  }
}

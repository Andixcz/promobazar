import "server-only";

import type { SocialAuthProviderId } from "@/lib/auth-social";

/** OAuth providery s vyplněnými serverovými credentials (bez secretů do klienta). */
export function listConfiguredSocialAuthProviders(): SocialAuthProviderId[] {
  const list: SocialAuthProviderId[] = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    list.push("google");
  }
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    list.push("discord");
  }
  return list;
}

export function buildBetterAuthSocialProviders():
  | Record<
      SocialAuthProviderId,
      { clientId: string; clientSecret: string }
    >
  | undefined {
  const providers: Partial<
    Record<SocialAuthProviderId, { clientId: string; clientSecret: string }>
  > = {};

  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (googleId && googleSecret) {
    providers.google = { clientId: googleId, clientSecret: googleSecret };
  }

  const discordId = process.env.DISCORD_CLIENT_ID;
  const discordSecret = process.env.DISCORD_CLIENT_SECRET;
  if (discordId && discordSecret) {
    providers.discord = { clientId: discordId, clientSecret: discordSecret };
  }

  if (!providers.google && !providers.discord) return undefined;
  return providers as Record<
    SocialAuthProviderId,
    { clientId: string; clientSecret: string }
  >;
}

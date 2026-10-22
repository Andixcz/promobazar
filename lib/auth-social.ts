export type SocialAuthProviderId = "google" | "discord";

/** Legacy: ruční zapnutí tlačítek přes `NEXT_PUBLIC_*` (preferuj serverový seznam). */
export function getEnabledSocialAuthProviders(): SocialAuthProviderId[] {
  const list: SocialAuthProviderId[] = [];
  if (process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true") {
    list.push("google");
  }
  if (process.env.NEXT_PUBLIC_DISCORD_OAUTH_ENABLED === "true") {
    list.push("discord");
  }
  return list;
}

/** Server props mají prioritu; jinak `NEXT_PUBLIC_*` pro starší deploye. */
export function resolveSocialAuthProviders(
  fromServer?: SocialAuthProviderId[],
): SocialAuthProviderId[] {
  if (fromServer && fromServer.length > 0) return fromServer;
  return getEnabledSocialAuthProviders();
}

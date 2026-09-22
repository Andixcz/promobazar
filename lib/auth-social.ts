export type SocialAuthProviderId = "google" | "discord";

/** Která OAuth tlačítka zobrazit (jen `NEXT_PUBLIC_*` — dostupné v prohlížeči). */
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

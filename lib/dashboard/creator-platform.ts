/** OAuth propojení tvůrce s platformou (dashboard) — sdílené typy klient / server. */
export type CreatorPlatformId =
  | "twitch"
  | "kick"
  | "tiktok"
  | "instagram"
  | "youtube";

export const CREATOR_PLATFORM_IDS: CreatorPlatformId[] = [
  "twitch",
  "kick",
  "tiktok",
  "youtube",
  "instagram",
];

export function isCreatorPlatformId(
  value: string,
): value is CreatorPlatformId {
  return (CREATOR_PLATFORM_IDS as string[]).includes(value);
}

export function creatorPlatformLabel(platform: CreatorPlatformId): string {
  switch (platform) {
    case "twitch":
      return "Twitch";
    case "kick":
      return "Kick";
    case "tiktok":
      return "TikTok";
    case "instagram":
      return "Instagram";
    case "youtube":
      return "YouTube";
  }
}

export function platformConnectApiPath(platform: CreatorPlatformId): string {
  return `/api/platform/connect/${platform}`;
}

export type PlatformConnectionSummary = {
  platform: CreatorPlatformId;
  platformUserId: string;
  username: string;
  connectedAt: string;
};

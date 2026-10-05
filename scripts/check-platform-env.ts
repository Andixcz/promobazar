import { loadEnvFiles } from "../lib/db/load-env";
import {
  CREATOR_PLATFORM_IDS,
  type CreatorPlatformId,
} from "../lib/dashboard/creator-platform";

loadEnvFiles();

const keys = [
  "TWITCH_CLIENT_ID",
  "TWITCH_CLIENT_SECRET",
  "KICK_CLIENT_ID",
  "KICK_CLIENT_SECRET",
  "TIKTOK_CLIENT_KEY",
  "TIKTOK_CLIENT_SECRET",
  "META_APP_ID",
  "META_APP_SECRET",
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

for (const key of keys) {
  const raw = process.env[key];
  const status = raw?.trim() ? "set" : "empty";
  console.log(`${key}=${status}`);
}

function isConfigured(platform: CreatorPlatformId): boolean {
  switch (platform) {
    case "twitch":
      return Boolean(
        process.env.TWITCH_CLIENT_ID?.trim() &&
          process.env.TWITCH_CLIENT_SECRET?.trim(),
      );
    case "kick":
      return Boolean(
        process.env.KICK_CLIENT_ID?.trim() &&
          process.env.KICK_CLIENT_SECRET?.trim(),
      );
    case "tiktok":
      return Boolean(
        process.env.TIKTOK_CLIENT_KEY?.trim() &&
          process.env.TIKTOK_CLIENT_SECRET?.trim(),
      );
    case "instagram":
      return Boolean(
        process.env.META_APP_ID?.trim() && process.env.META_APP_SECRET?.trim(),
      );
    case "youtube":
      return Boolean(
        (process.env.YOUTUBE_CLIENT_ID?.trim() ||
          process.env.GOOGLE_CLIENT_ID?.trim()) &&
          (process.env.YOUTUBE_CLIENT_SECRET?.trim() ||
            process.env.GOOGLE_CLIENT_SECRET?.trim()),
      );
  }
}

const configured = CREATOR_PLATFORM_IDS.filter(isConfigured);
console.log(
  "configured platforms:",
  configured.join(", ") || "(none)",
);

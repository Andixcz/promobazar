import "server-only";

import type { CreatorPlatformId } from "@/lib/dashboard/creator-platform";
import {
  getCreatorPlatformOAuthConfig,
  platformOAuthCallbackPath,
} from "@/lib/dashboard/platform-linking-env";
import type { PlatformTokenBundle } from "@/lib/dashboard/platform-linking-connections";

export function appPublicBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.BETTER_AUTH_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

function redirectUri(platform: CreatorPlatformId): string {
  return `${appPublicBaseUrl()}${platformOAuthCallbackPath(platform)}`;
}

export function createOAuthState(): string {
  return crypto.randomUUID();
}

export async function createPkcePair(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const codeVerifier = Buffer.from(bytes).toString("base64url");
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier),
  );
  const codeChallenge = Buffer.from(digest).toString("base64url");
  return { codeVerifier, codeChallenge };
}

export function buildPlatformAuthorizeUrl(
  platform: CreatorPlatformId,
  state: string,
  codeChallenge?: string,
): string | null {
  const redirect = redirectUri(platform);

  switch (platform) {
    case "twitch": {
      const config = getCreatorPlatformOAuthConfig("twitch");
      if (!config || !("clientId" in config)) return null;
      const clientId = config.clientId;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirect,
        response_type: "code",
        scope: "user:read:email",
        state,
      });
      return `https://id.twitch.tv/oauth2/authorize?${params}`;
    }
    case "kick": {
      if (!codeChallenge) return null;
      const config = getCreatorPlatformOAuthConfig("kick");
      if (!config || !("clientId" in config)) return null;
      const clientId = config.clientId;
      const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: redirect,
        scope: "user:read",
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });
      return `https://id.kick.com/oauth/authorize?${params}`;
    }
    case "tiktok": {
      const config = getCreatorPlatformOAuthConfig("tiktok");
      if (!config || !("clientKey" in config)) return null;
      const clientKey = config.clientKey;
      const params = new URLSearchParams({
        client_key: clientKey,
        redirect_uri: redirect,
        response_type: "code",
        scope: "user.info.basic,user.info.profile",
        state,
      });
      return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
    }
    case "instagram": {
      const config = getCreatorPlatformOAuthConfig("instagram");
      if (!config || !("clientId" in config)) return null;
      const clientId = config.clientId;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirect,
        response_type: "code",
        scope: "instagram_basic,pages_show_list",
        state,
      });
      return `https://www.facebook.com/v21.0/dialog/oauth?${params}`;
    }
    case "youtube": {
      const config = getCreatorPlatformOAuthConfig("youtube");
      if (!config || !("clientId" in config)) return null;
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: redirect,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        access_type: "offline",
        prompt: "consent",
        state,
      });
      return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }
    default:
      return null;
  }
}

async function postForm(
  url: string,
  body: Record<string, string>,
): Promise<Record<string, unknown>> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      typeof json.message === "string"
        ? json.message
        : typeof json.error === "string"
          ? json.error
          : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return json;
}

function expiresAtFromSeconds(seconds: unknown): Date | null {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return null;
  return new Date(Date.now() + seconds * 1000);
}

export async function exchangePlatformCode(
  platform: CreatorPlatformId,
  code: string,
  codeVerifier?: string,
): Promise<PlatformTokenBundle> {
  const redirect = redirectUri(platform);

  switch (platform) {
    case "twitch": {
      const config = getCreatorPlatformOAuthConfig("twitch");
      if (!config || !("clientId" in config)) {
        throw new Error("Provider není nakonfigurovaný.");
      }
      const token = await postForm("https://id.twitch.tv/oauth2/token", {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirect,
      });
      const accessToken = String(token.access_token ?? "");
      const userRes = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": config.clientId,
        },
      });
      const userJson = (await userRes.json()) as {
        data?: { id: string; login: string; display_name?: string }[];
      };
      const user = userJson.data?.[0];
      if (!user) throw new Error("Nepodařilo se načíst Twitch profil.");
      return {
        platformUserId: user.id,
        username: user.login,
        accessToken,
        refreshToken:
          typeof token.refresh_token === "string" ? token.refresh_token : null,
        tokenExpiresAt: expiresAtFromSeconds(token.expires_in),
      };
    }
    case "kick": {
      if (!codeVerifier) throw new Error("Chybí PKCE verifier.");
      const config = getCreatorPlatformOAuthConfig("kick");
      if (!config || !("clientId" in config)) {
        throw new Error("Provider není nakonfigurovaný.");
      }
      const token = await postForm("https://id.kick.com/oauth/token", {
        grant_type: "authorization_code",
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirect,
        code_verifier: codeVerifier,
      });
      const accessToken = String(token.access_token ?? "");
      const userRes = await fetch("https://api.kick.com/public/v1/users", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userJson = (await userRes.json()) as {
        data?: { user_id: number; name?: string }[];
      };
      const user = userJson.data?.[0];
      if (!user) throw new Error("Nepodařilo se načíst Kick profil.");
      const username = user.name?.trim() || String(user.user_id);
      return {
        platformUserId: String(user.user_id),
        username,
        accessToken,
        refreshToken:
          typeof token.refresh_token === "string" ? token.refresh_token : null,
        tokenExpiresAt: expiresAtFromSeconds(token.expires_in),
      };
    }
    case "tiktok": {
      const config = getCreatorPlatformOAuthConfig("tiktok");
      if (!config || !("clientKey" in config)) {
        throw new Error("Provider není nakonfigurovaný.");
      }
      const token = await postForm(
        "https://open.tiktokapis.com/v2/oauth/token/",
        {
          client_key: config.clientKey,
          client_secret: config.clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirect,
        },
      );
      const accessToken = String(token.access_token ?? "");
      const userRes = await fetch(
        "https://open.tiktokapis.com/v2/user/info/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: ["open_id", "username", "display_name"],
          }),
        },
      );
      const userJson = (await userRes.json()) as {
        data?: {
          user?: {
            open_id?: string;
            username?: string;
            display_name?: string;
          };
        };
      };
      const user = userJson.data?.user;
      if (!user?.open_id) throw new Error("Nepodařilo se načíst TikTok profil.");
      const username =
        user.username?.trim() || user.display_name?.trim() || user.open_id;
      return {
        platformUserId: user.open_id,
        username,
        accessToken,
        refreshToken:
          typeof token.refresh_token === "string" ? token.refresh_token : null,
        tokenExpiresAt: expiresAtFromSeconds(token.expires_in),
      };
    }
    case "instagram": {
      const config = getCreatorPlatformOAuthConfig("instagram");
      if (!config || !("clientId" in config)) {
        throw new Error("Provider není nakonfigurovaný.");
      }
      const tokenRes = await fetch(
        `https://graph.facebook.com/v21.0/oauth/access_token?${new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: redirect,
          code,
        })}`,
      );
      const token = (await tokenRes.json()) as {
        access_token?: string;
        expires_in?: number;
        error?: { message?: string };
      };
      if (!token.access_token) {
        throw new Error(
          token.error?.message ?? "Nepodařilo se získat Meta access token.",
        );
      }
      const accessToken = token.access_token;
      const accountsRes = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=instagram_business_account{username,id}&access_token=${encodeURIComponent(accessToken)}`,
      );
      const accountsJson = (await accountsRes.json()) as {
        data?: {
          instagram_business_account?: { id?: string; username?: string };
        }[];
        error?: { message?: string };
      };
      if (accountsJson.error) {
        throw new Error(accountsJson.error.message ?? "Meta API chyba.");
      }
      const igAccount = accountsJson.data
        ?.map((page) => page.instagram_business_account)
        .find((ig) => ig?.id && ig.username);
      if (!igAccount?.id || !igAccount.username) {
        throw new Error(
          "Nenašli jsme Instagram účet propojený s Facebook stránkou.",
        );
      }
      return {
        platformUserId: igAccount.id,
        username: igAccount.username,
        accessToken,
        refreshToken: null,
        tokenExpiresAt: expiresAtFromSeconds(token.expires_in),
      };
    }
    case "youtube": {
      const config = getCreatorPlatformOAuthConfig("youtube");
      if (!config || !("clientId" in config)) {
        throw new Error("Provider není nakonfigurovaný.");
      }
      const token = await postForm("https://oauth2.googleapis.com/token", {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirect,
      });
      const accessToken = String(token.access_token ?? "");
      const channelRes = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      const channelJson = (await channelRes.json()) as {
        items?: {
          id?: string;
          snippet?: { customUrl?: string; title?: string };
        }[];
        error?: { message?: string };
      };
      if (!channelRes.ok || channelJson.error) {
        throw new Error(
          channelJson.error?.message ??
            "Nepodařilo se načíst YouTube kanál.",
        );
      }
      const channel = channelJson.items?.[0];
      if (!channel?.id) {
        throw new Error("Na účtu Google nemáme přístup k YouTube kanálu.");
      }
      const customUrl = channel.snippet?.customUrl?.replace(/^@/, "").trim();
      const username =
        customUrl || channel.snippet?.title?.trim() || channel.id;
      return {
        platformUserId: channel.id,
        username,
        accessToken,
        refreshToken:
          typeof token.refresh_token === "string" ? token.refresh_token : null,
        tokenExpiresAt: expiresAtFromSeconds(token.expires_in),
      };
    }
    default:
      throw new Error("Neznámá platforma.");
  }
}

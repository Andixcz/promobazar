const MAX_VIDEO_URL_LENGTH = 500;

/** Vrací ID videa nebo null, když URL není YouTube. */
export function parseYoutubeVideoId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "embed" || parts[0] === "shorts") {
      const id = parts[1];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
  }

  return null;
}

export function youtubeEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params}`;
}

export function normalizePackagePreviewVideoUrl(
  raw: string | null | undefined,
): string | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  if (value.length > MAX_VIDEO_URL_LENGTH) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const ytId = parseYoutubeVideoId(url.href);
  if (ytId) {
    return `https://www.youtube.com/watch?v=${ytId}`;
  }

  return url.href;
}

export function packagePreviewVideoError(
  raw: string | null | undefined,
): string | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  if (value.length > MAX_VIDEO_URL_LENGTH) {
    return "Odkaz na video je příliš dlouhý.";
  }
  if (!normalizePackagePreviewVideoUrl(value)) {
    return "Zadej platnou adresu videa (https). U YouTube stačí odkaz ze sdílení.";
  }
  return null;
}

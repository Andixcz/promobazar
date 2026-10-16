import { parseStoragePublicUrl } from "@/lib/storage/storage-url";

export const PACKAGE_SHOWCASE_MAX = 6;

export function isOwnedPackageShowcaseUrl(url: string, userId: string): boolean {
  const key = parseStoragePublicUrl(url.trim());
  if (!key) return false;
  return key.startsWith(`uploads/${userId}/package-showcase/`);
}

export function normalizePackageShowcaseUrls(
  urls: string[] | null | undefined,
  userId: string,
): string[] {
  if (!urls?.length) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    const url = String(raw ?? "").trim();
    if (!url || seen.has(url)) continue;
    if (!isOwnedPackageShowcaseUrl(url, userId)) continue;
    seen.add(url);
    out.push(url);
    if (out.length >= PACKAGE_SHOWCASE_MAX) break;
  }
  return out;
}

export function normalizePackageBannerUrl(
  bannerUrl: string | null | undefined,
  showcaseUrls: string[],
): string | null {
  const url = bannerUrl?.trim();
  if (!url) return null;
  return showcaseUrls.includes(url) ? url : showcaseUrls[0] ?? null;
}

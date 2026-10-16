const STORAGE_PREFIX = "/api/storage/";

export function storagePublicUrl(objectKey: string): string {
  const segments = objectKey.split("/").map((s) => encodeURIComponent(s));
  return `${STORAGE_PREFIX}${segments.join("/")}`;
}

export function parseStoragePublicUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed.startsWith(STORAGE_PREFIX)) return null;
  const rest = trimmed.slice(STORAGE_PREFIX.length);
  if (!rest || rest.includes("..")) return null;
  try {
    return rest
      .split("/")
      .map((part) => decodeURIComponent(part))
      .join("/");
  } catch {
    return null;
  }
}

export function isAllowedProfileMediaUrl(
  url: string | null | undefined,
): boolean {
  if (!url?.trim()) return true;
  const trimmed = url.trim();
  if (trimmed.startsWith("data:image/")) return true;
  if (parseStoragePublicUrl(trimmed)) return true;
  if (/^https?:\/\//i.test(trimmed)) return true;
  return false;
}

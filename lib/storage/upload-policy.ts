export type UploadPurpose =
  | "avatar"
  | "banner"
  | "file"
  | "order-brief"
  | "package-showcase";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const FILE_TYPES = new Set([
  ...IMAGE_TYPES,
  "application/zip",
  "application/x-zip-compressed",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const ORDER_BRIEF_TYPES = new Set([
  ...IMAGE_TYPES,
  ...VIDEO_TYPES,
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
]);

const MAX_BYTES: Record<UploadPurpose, number> = {
  avatar: 5 * 1024 * 1024,
  banner: 10 * 1024 * 1024,
  "package-showcase": 8 * 1024 * 1024,
  "order-brief": 100 * 1024 * 1024,
  file: 500 * 1024 * 1024,
};

export function isUploadPurpose(value: string): value is UploadPurpose {
  return (
    value === "avatar" ||
    value === "banner" ||
    value === "file" ||
    value === "order-brief" ||
    value === "package-showcase"
  );
}

export function allowedContentTypes(purpose: UploadPurpose): Set<string> {
  if (purpose === "file") return FILE_TYPES;
  if (purpose === "order-brief") return ORDER_BRIEF_TYPES;
  return IMAGE_TYPES;
}

export function maxUploadBytes(purpose: UploadPurpose): number {
  return MAX_BYTES[purpose];
}

export function sanitizeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "file";
  const cleaned = base
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return cleaned || "file";
}

export function buildObjectKey(
  userId: string,
  purpose: UploadPurpose,
  fileName: string,
): string {
  if (purpose === "avatar") {
    return `uploads/${userId}/avatar/profile`;
  }
  if (purpose === "banner") {
    return `uploads/${userId}/banner/cover`;
  }
  if (purpose === "order-brief") {
    const safe = sanitizeFileName(fileName);
    const ext = safe.includes(".") ? safe.slice(safe.lastIndexOf(".")) : "";
    const id = crypto.randomUUID();
    return `uploads/${userId}/order-brief/${id}${ext}`;
  }

  const safe = sanitizeFileName(fileName);
  const ext = safe.includes(".") ? safe.slice(safe.lastIndexOf(".")) : "";
  const id = crypto.randomUUID();
  return `uploads/${userId}/${purpose}/${id}${ext}`;
}

/** Veřejné profilové médium: kdokoli s URL může zobrazit (UUID v cestě). */
export function isPublicStorageObjectKey(key: string): boolean {
  return /^uploads\/[^/]+\/(avatar|banner|package-showcase)\//.test(key);
}

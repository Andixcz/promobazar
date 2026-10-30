import { parseStoragePublicUrl } from "@/lib/storage/storage-url";
import {
  allowedContentTypes,
  type UploadPurpose,
} from "@/lib/storage/upload-policy";

export type OrderBriefAttachment = {
  url: string;
  name: string;
  contentType: string;
};

export const ORDER_BRIEF_ATTACHMENT_MAX = 8;

export const ORDER_BRIEF_UPLOAD_PURPOSE: UploadPurpose = "order-brief";

export const ORDER_BRIEF_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,application/pdf,application/zip,application/x-zip-compressed";

const allowed = allowedContentTypes(ORDER_BRIEF_UPLOAD_PURPOSE);

export function isOrderBriefAttachment(value: unknown): value is OrderBriefAttachment {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.url === "string" &&
    typeof row.name === "string" &&
    typeof row.contentType === "string"
  );
}

export function parseOrderBriefAttachmentsJson(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  return JSON.parse(trimmed) as unknown;
}

export function validateOrderBriefAttachments(
  clientUserId: string,
  raw: unknown,
): { ok: true; data: OrderBriefAttachment[] } | { ok: false; error: string } {
  if (raw == null || raw === "") {
    return { ok: true, data: [] };
  }

  let list: unknown;
  if (typeof raw === "string") {
    try {
      list = parseOrderBriefAttachmentsJson(raw);
    } catch {
      return { ok: false, error: "Neplatný formát příloh." };
    }
  } else {
    list = raw;
  }

  if (!Array.isArray(list)) {
    return { ok: false, error: "Neplatný formát příloh." };
  }
  if (list.length > ORDER_BRIEF_ATTACHMENT_MAX) {
    return {
      ok: false,
      error: `Maximálně ${ORDER_BRIEF_ATTACHMENT_MAX} souborů.`,
    };
  }

  const out: OrderBriefAttachment[] = [];
  for (const item of list) {
    if (!isOrderBriefAttachment(item)) {
      return { ok: false, error: "Neplatná příloha." };
    }
    const name = item.name.trim().slice(0, 200) || "soubor";
    const contentType = item.contentType.trim().toLowerCase();
    if (!allowed.has(contentType)) {
      return { ok: false, error: "Nepovolený typ souboru u přílohy." };
    }
    const objectKey = parseStoragePublicUrl(item.url);
    if (!objectKey) {
      return { ok: false, error: "Neplatná URL přílohy." };
    }
    const prefix = `uploads/${clientUserId}/order-brief/`;
    if (!objectKey.startsWith(prefix)) {
      return { ok: false, error: "Příloha nepatří k tvému účtu." };
    }
    out.push({ url: item.url.trim(), name, contentType });
  }

  return { ok: true, data: out };
}

export function attachmentKind(contentType: string): "image" | "video" | "file" {
  if (contentType.startsWith("image/")) return "image";
  if (contentType.startsWith("video/")) return "video";
  return "file";
}

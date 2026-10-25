import {
  allowedContentTypes,
  buildObjectKey,
  isUploadPurpose,
  maxUploadBytes,
  type UploadPurpose,
} from "@/lib/storage/upload-policy";

export type ValidatedUpload = {
  purpose: UploadPurpose;
  contentType: string;
  objectKey: string;
};

export function validateUploadInput(
  userId: string,
  input: {
    purpose: string;
    fileName: string;
    contentType: string;
    size: number;
  },
): { ok: true; data: ValidatedUpload } | { ok: false; error: string; status: number } {
  const purpose = input.purpose ?? "";
  if (!isUploadPurpose(purpose)) {
    return { ok: false, error: "Neplatný účel nahrání.", status: 400 };
  }

  const contentType = (input.contentType ?? "").trim().toLowerCase();
  if (!allowedContentTypes(purpose).has(contentType)) {
    return {
      ok: false,
      error: "Tento typ souboru není povolený.",
      status: 400,
    };
  }

  const size = Number(input.size);
  if (!Number.isFinite(size) || size <= 0) {
    return { ok: false, error: "Neplatná velikost souboru.", status: 400 };
  }
  if (size > maxUploadBytes(purpose)) {
    return { ok: false, error: "Soubor je příliš velký.", status: 400 };
  }

  const fileName = (input.fileName ?? "file").trim() || "file";
  const objectKey = buildObjectKey(userId, purpose, fileName);

  return {
    ok: true,
    data: { purpose, contentType, objectKey },
  };
}

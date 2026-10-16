import type { UploadPurpose } from "@/lib/storage/upload-policy";

export class StorageUnavailableError extends Error {
  constructor() {
    super("Úložiště souborů není nakonfigurované.");
    this.name = "StorageUnavailableError";
  }
}

export type PresignResponse = {
  uploadUrl: string;
  fileUrl: string;
  objectKey: string;
};

export async function uploadFileToStorage(
  file: File,
  purpose: UploadPurpose,
): Promise<string> {
  const presignRes = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      purpose,
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
    }),
  });

  if (!presignRes.ok) {
    if (presignRes.status === 503) {
      throw new StorageUnavailableError();
    }
    const body = (await presignRes.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Nepodařilo se připravit nahrání.");
  }

  const { uploadUrl, fileUrl } = (await presignRes.json()) as PresignResponse;

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error("Nahrání souboru do úložiště selhalo.");
  }

  return fileUrl;
}

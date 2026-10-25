import type { UploadPurpose } from "@/lib/storage/upload-policy";

export class StorageUnavailableError extends Error {
  constructor() {
    super("Úložiště souborů není nakonfigurované.");
    this.name = "StorageUnavailableError";
  }
}

type UploadResponse = {
  fileUrl: string;
};

/** Same-origin upload: nevyžaduje CORS na B2 bucketu (na rozdíl od presigned PUT z prohlížeče). */
export async function uploadFileToStorage(
  file: File,
  purpose: UploadPurpose,
): Promise<string> {
  const form = new FormData();
  form.set("purpose", purpose);
  form.set("file", file);

  let res: Response;
  try {
    res = await fetch("/api/uploads", {
      method: "POST",
      credentials: "include",
      body: form,
    });
  } catch {
    throw new Error(
      "Spojení se serverem selhalo. Zkontroluj připojení a zkus to znovu.",
    );
  }

  if (!res.ok) {
    if (res.status === 503) {
      throw new StorageUnavailableError();
    }
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Nepodařilo se nahrát soubor.");
  }

  const { fileUrl } = (await res.json()) as UploadResponse;
  if (!fileUrl) {
    throw new Error("Server nevrátil URL souboru.");
  }
  return fileUrl;
}

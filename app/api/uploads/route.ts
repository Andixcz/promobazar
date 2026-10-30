import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-session";
import { putObjectBuffer } from "@/lib/storage/b2-client";
import { isB2Configured } from "@/lib/storage/b2-env";
import { storagePublicUrl, profileMediaPublicUrl } from "@/lib/storage/storage-url";
import { validateUploadInput } from "@/lib/storage/validate-upload";

export async function POST(request: Request) {
  if (!isB2Configured()) {
    return NextResponse.json(
      { error: "Úložiště souborů není nakonfigurované." },
      { status: 503 },
    );
  }

  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Nepřihlášený uživatel." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Neplatná data formuláře." }, { status: 400 });
  }

  const purpose = String(form.get("purpose") ?? "");
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Chybí soubor." }, { status: 400 });
  }

  const validated = validateUploadInput(session.user.id, {
    purpose,
    fileName: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
  });
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error },
      { status: validated.status },
    );
  }

  const { objectKey, contentType, purpose: uploadPurpose } = validated.data;

  try {
    const body = new Uint8Array(await file.arrayBuffer());
    await putObjectBuffer({ objectKey, contentType, body });
    const fileUrl =
      uploadPurpose === "avatar" || uploadPurpose === "banner"
        ? profileMediaPublicUrl(objectKey)
        : storagePublicUrl(objectKey);
    return NextResponse.json({
      objectKey,
      fileUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Nahrání do úložiště selhalo." },
      { status: 500 },
    );
  }
}

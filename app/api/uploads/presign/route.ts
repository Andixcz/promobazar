import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-session";
import { createPresignedUploadUrl } from "@/lib/storage/b2-client";
import { isB2Configured } from "@/lib/storage/b2-env";
import { storagePublicUrl } from "@/lib/storage/storage-url";
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

  let body: {
    purpose?: string;
    fileName?: string;
    contentType?: string;
    size?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const validated = validateUploadInput(session.user.id, {
    purpose: body.purpose ?? "",
    fileName: body.fileName ?? "file",
    contentType: body.contentType ?? "",
    size: Number(body.size),
  });
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error },
      { status: validated.status },
    );
  }

  const { objectKey, contentType } = validated.data;

  try {
    const uploadUrl = await createPresignedUploadUrl({
      objectKey,
      contentType,
    });
    return NextResponse.json({
      uploadUrl,
      objectKey,
      fileUrl: storagePublicUrl(objectKey),
    });
  } catch {
    return NextResponse.json(
      { error: "Presigned URL se nepodařilo vytvořit." },
      { status: 500 },
    );
  }
}

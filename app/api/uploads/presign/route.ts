import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-session";
import { createPresignedUploadUrl } from "@/lib/storage/b2-client";
import { isB2Configured } from "@/lib/storage/b2-env";
import { storagePublicUrl } from "@/lib/storage/storage-url";
import {
  allowedContentTypes,
  buildObjectKey,
  isUploadPurpose,
  maxUploadBytes,
} from "@/lib/storage/upload-policy";

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

  const purpose = body.purpose ?? "";
  if (!isUploadPurpose(purpose)) {
    return NextResponse.json({ error: "Neplatný účel nahrání." }, { status: 400 });
  }

  const contentType = (body.contentType ?? "").trim().toLowerCase();
  if (!allowedContentTypes(purpose).has(contentType)) {
    return NextResponse.json(
      { error: "Tento typ souboru není povolený." },
      { status: 400 },
    );
  }

  const size = Number(body.size);
  if (!Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: "Neplatná velikost souboru." }, { status: 400 });
  }
  if (size > maxUploadBytes(purpose)) {
    return NextResponse.json(
      { error: "Soubor je příliš velký." },
      { status: 400 },
    );
  }

  const fileName = (body.fileName ?? "file").trim() || "file";
  const objectKey = buildObjectKey(session.user.id, purpose, fileName);

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

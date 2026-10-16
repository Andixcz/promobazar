import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-session";
import { getObjectStream } from "@/lib/storage/b2-client";
import { isB2Configured } from "@/lib/storage/b2-env";
import { isPublicStorageObjectKey } from "@/lib/storage/upload-policy";

type RouteContext = { params: Promise<{ key: string[] }> };

function canReadObject(objectKey: string, userId: string | undefined): boolean {
  if (isPublicStorageObjectKey(objectKey)) return true;
  if (!userId) return false;
  return objectKey.startsWith(`uploads/${userId}/`);
}

export async function GET(_request: Request, context: RouteContext) {
  if (!isB2Configured()) {
    return NextResponse.json({ error: "Úložiště není dostupné." }, { status: 503 });
  }

  const { key: segments } = await context.params;
  if (!segments?.length || segments.some((s) => s === ".." || !s)) {
    return NextResponse.json({ error: "Neplatná cesta." }, { status: 400 });
  }

  const objectKey = segments.map((s) => decodeURIComponent(s)).join("/");
  const session = await getServerSession();
  if (!canReadObject(objectKey, session?.user?.id)) {
    return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });
  }

  try {
    const object = await getObjectStream(objectKey);
    if (!object.Body) {
      return NextResponse.json({ error: "Soubor nenalezen." }, { status: 404 });
    }

    const bytes = await object.Body.transformToByteArray();
    const contentType =
      object.ContentType ?? "application/octet-stream";

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": isPublicStorageObjectKey(objectKey)
          ? "public, max-age=86400, stale-while-revalidate=604800"
          : "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Soubor nenalezen." }, { status: 404 });
  }
}

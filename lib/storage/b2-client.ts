import "server-only";

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  getB2Config,
  withKeyPrefix,
  type B2Config,
} from "@/lib/storage/b2-env";

let cached: { cacheKey: string; client: S3Client; config: B2Config } | null =
  null;

function getClient(): { config: B2Config; client: S3Client } | null {
  const config = getB2Config();
  if (!config) return null;
  const cacheKey = `${config.keyId}:${config.bucket}:${config.endpoint}`;
  if (cached?.cacheKey === cacheKey) return cached;
  const client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.keyId,
      secretAccessKey: config.applicationKey,
    },
    forcePathStyle: true,
  });
  cached = { cacheKey, config, client };
  return cached;
}

export function requireB2Client() {
  const ctx = getClient();
  if (!ctx) {
    throw new Error("B2 úložiště není nakonfigurované.");
  }
  return ctx;
}

export async function createPresignedUploadUrl(input: {
  objectKey: string;
  contentType: string;
  expiresInSec?: number;
}): Promise<string> {
  const { config, client } = requireB2Client();
  const key = withKeyPrefix(config, input.objectKey);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: input.contentType,
  });
  return getSignedUrl(client, command, {
    expiresIn: input.expiresInSec ?? 600,
  });
}

export async function getObjectStream(objectKey: string) {
  const { config, client } = requireB2Client();
  const key = withKeyPrefix(config, objectKey);
  const response = await client.send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
  return response;
}

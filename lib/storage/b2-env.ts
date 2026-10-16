import "server-only";

export type B2Config = {
  keyId: string;
  applicationKey: string;
  bucket: string;
  region: string;
  endpoint: string;
  /** Volitelný prefix v bucketu, např. `dev/` */
  keyPrefix: string;
};

function trimSlash(s: string) {
  return s.replace(/^\/+|\/+$/g, "");
}

export function isB2Configured(): boolean {
  return getB2Config() !== null;
}

export function getB2Config(): B2Config | null {
  const keyId = process.env.B2_KEY_ID?.trim();
  const applicationKey = process.env.B2_APPLICATION_KEY?.trim();
  const bucket = process.env.B2_BUCKET_NAME?.trim();
  const region = process.env.B2_S3_REGION?.trim();
  const endpoint = process.env.B2_S3_ENDPOINT?.trim();
  if (!keyId || !applicationKey || !bucket || !region || !endpoint) {
    return null;
  }
  const prefix = trimSlash(process.env.B2_UPLOAD_PREFIX?.trim() ?? "");
  return {
    keyId,
    applicationKey,
    bucket,
    region,
    endpoint,
    keyPrefix: prefix,
  };
}

export function withKeyPrefix(config: B2Config, objectKey: string): string {
  const key = trimSlash(objectKey);
  if (!config.keyPrefix) return key;
  return `${config.keyPrefix}/${key}`;
}

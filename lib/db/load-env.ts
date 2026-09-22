/**
 * Načte `.env.local` a `.env` pro drizzle-kit (mimo Next.js).
 * V aplikaci env řeší Next automaticky.
 */
import { config } from "dotenv";
import { resolve } from "node:path";

export function loadEnvFiles() {
  config({ path: resolve(process.cwd(), ".env.local") });
  config({ path: resolve(process.cwd(), ".env") });
}

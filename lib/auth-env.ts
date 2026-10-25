import "server-only";

/** Kanonická URL pro Better Auth (OAuth redirecty, e-maily). */
export function authBaseUrl(): string {
  const fromEnv =
    process.env.BETTER_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  throw new Error("Nastav BETTER_AUTH_URL nebo NEXT_PUBLIC_APP_URL.");
}

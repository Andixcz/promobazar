const DEFAULT_SITE = "https://promobazar.cz";

export function emailSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  return fromEnv || DEFAULT_SITE;
}

/** V preview (`bun run email:dev`) servuje React Email soubory z `emails/static/`. */
export function emailLogoUrl(): string {
  if (process.env.REACT_EMAIL_INTERNAL_PREVIEW_SERVER_LOCATION) {
    return "/static/logo.png";
  }
  return `${emailSiteUrl()}/logo.png`;
}

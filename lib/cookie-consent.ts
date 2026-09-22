export const COOKIE_CONSENT_KEY = "pb_cookie_consent";

export const COOKIE_SETTINGS_OPEN_EVENT = "pb-open-cookie-settings";

export type CookieConsentChoice = "essential" | "all" | "custom";

export function getCookieConsent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COOKIE_CONSENT_KEY);
}

export function setCookieConsent(choice: CookieConsentChoice | string): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  window.dispatchEvent(new Event("pb-cookie-consent-changed"));
}

export function openCookieSettingsDialog(): void {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_OPEN_EVENT));
}

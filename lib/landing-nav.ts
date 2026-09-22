import { invokeAppGlobal } from "@/lib/app-global";
import {
  LANDING_CREATORS_PATH,
  LANDING_FIRMS_PATH,
  landingHref,
} from "@/lib/landing-routes";
import { scrollToSection } from "@/lib/scroll-to-section";

/** Veřejný přehled poptávek (záložka browse) — navigace v Reactu, ne legacy switchView. */
export function goToJobBoardBrowse(): void {
  if (window.location.pathname !== LANDING_FIRMS_PATH) {
    window.location.assign(landingHref("firms", "job-board"));
    return;
  }
  invokeAppGlobal("switchJobTab", "browse");
  scrollToSection("job-board");
}

/** Po načtení /#job-board nastav správnou záložku job boardu. */
export function syncJobBoardFromHash(pathname: string): void {
  if (pathname !== LANDING_FIRMS_PATH) return;
  const hash = window.location.hash.replace("#", "");
  if (hash !== "job-board") return;
  invokeAppGlobal("switchJobTab", "browse");
  scrollToSection("job-board");
}

/** Po načtení hash na stránce tvůrců. */
export function syncCreatorsHashScroll(): void {
  if (
    window.location.pathname !== LANDING_CREATORS_PATH &&
    !window.location.pathname.startsWith(`${LANDING_CREATORS_PATH}/`)
  ) {
    return;
  }
  const id = window.location.hash.replace("#", "");
  if (id) scrollToSection(id);
}

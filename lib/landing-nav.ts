import { LANDING_CREATORS_PATH } from "@/lib/landing-routes";
import { scrollToSection } from "@/lib/scroll-to-section";

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

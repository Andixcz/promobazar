import { readFileSync } from "fs";
import path from "path";

const SITE_BODY_PATH = path.join(process.cwd(), "public/site-body.html");
const MARKETPLACE_MARKER = "<!-- MARKETPLACE -->";

export type SiteBodyParts = {
  /** `<main id="view-firms">` až po hero (před MARKETPLACE). */
  firmsMainOpen: string;
  /** Od MARKETPLACE včetně zbytek stránky (vč. view-creators). */
  bodyTailHtml: string;
};

export function getSiteBodyParts(): SiteBodyParts {
  const html = readFileSync(SITE_BODY_PATH, "utf8");
  const idx = html.indexOf(MARKETPLACE_MARKER);
  if (idx === -1) {
    throw new Error(`Site body missing marker: ${MARKETPLACE_MARKER}`);
  }
  return {
    firmsMainOpen: html.slice(0, idx),
    bodyTailHtml: html.slice(idx),
  };
}

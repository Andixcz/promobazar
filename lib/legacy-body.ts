import { readFileSync } from "fs";
import path from "path";

const LEGACY_BODY_PATH = path.join(process.cwd(), "public/legacy-body.html");
const MARKETPLACE_MARKER = "<!-- MARKETPLACE -->";

export type LegacyBodyParts = {
  /** `<main id="view-firms">` až po hero (před MARKETPLACE). */
  firmsMainOpen: string;
  /** Od MARKETPLACE včetně zbytek stránky (vč. view-creators). */
  legacyTailHtml: string;
};

export function getLegacyBodyParts(): LegacyBodyParts {
  const html = readFileSync(LEGACY_BODY_PATH, "utf8");
  const idx = html.indexOf(MARKETPLACE_MARKER);
  if (idx === -1) {
    throw new Error(`Legacy body missing marker: ${MARKETPLACE_MARKER}`);
  }
  return {
    firmsMainOpen: html.slice(0, idx),
    legacyTailHtml: html.slice(idx),
  };
}

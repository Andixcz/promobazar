/** Zveřejněná sazba v pásmu 10–12 %. U oddělených plateb si ji necháme tím, že převedeme míň. */
export const PLATFORM_FEE_BPS = 1200;

export const ACCEPT_WINDOW_MS = 48 * 60 * 60 * 1000;
export const REVIEW_WINDOW_MS = 72 * 60 * 60 * 1000;

export function splitChargeHalere(amountCzk: number, feeBps: number) {
  const grossHalere = amountCzk * 100;
  const feeHalere = Math.round((grossHalere * feeBps) / 10_000);
  const transferHalere = grossHalere - feeHalere;
  return { grossHalere, feeHalere, transferHalere };
}

export function payoutCzk(amountCzk: number, feeBps: number) {
  return splitChargeHalere(amountCzk, feeBps).transferHalere / 100;
}

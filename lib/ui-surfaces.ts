/** Sdílené Tailwind třídy pro landing (React + app.js — drž v sync u tlačítek). */

export const section = "px-5 md:px-8 py-16 md:py-24";
export const sectionX = "px-5 md:px-8";

export const surface = "rounded-md border border-white/[0.09] bg-panel";

export const glassBar = surface;
export const glassPanel = surface;

export const modalScrim =
  "bg-[rgba(4,3,8,0.72)] backdrop-blur-[6px]";

export const eyebrow =
  "font-body text-[11px] font-medium uppercase tracking-wide text-cyan";

export const resultCount =
  "self-start rounded-sm border border-white/[0.09] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-mist tabular-nums";

export const emptyState =
  "flex flex-col items-center rounded-md border border-white/[0.09] bg-panel px-6 py-14 text-center md:px-12 md:py-16";

export const emptyStateIcon =
  "mb-5 flex size-12 items-center justify-center rounded-sm border border-white/[0.12] bg-white/[0.04] text-mist";

export const emptyStateTitle =
  "font-display text-lg font-semibold text-white md:text-xl";

export const emptyStateSubtitle =
  "mt-2 max-w-md text-sm leading-relaxed text-zinc-200";

export const emptyStateActions =
  "mt-6 flex flex-wrap items-center justify-center gap-3";

export const stepBadge =
  "mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-cyan font-display text-xl font-bold text-void";

export const pricingCard =
  "relative rounded-md border border-white/[0.09] bg-panel p-8";

export const pricingCardFeatured = "border-magenta/40";

export const pricingIcon =
  "mb-6 flex size-[52px] shrink-0 items-center justify-center rounded-sm bg-cyan text-void [&_svg]:size-6";

export const pricingBadge =
  "absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-transparent bg-cyan px-4 py-1.5 font-body text-[11px] font-medium uppercase tracking-wide text-void";

const btnBase =
  "inline-flex shrink-0 items-center justify-center rounded-sm border bg-clip-padding font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none";

export const htmlButtonCta = `${btnBase} text-sm border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1.5 px-7 py-3.5`;

export const htmlButtonCtaSm = `${btnBase} text-xs border-transparent bg-cyan text-void hover:bg-cyan/85 h-auto gap-1 px-4 py-2.5`;

export const htmlButtonOutline = `${btnBase} text-sm border-white/[0.14] bg-white/[0.04] text-white/85 hover:bg-white/[0.09] hover:border-white/[0.24] h-auto gap-1.5 px-7 py-3.5`;

export const htmlButtonOutlineSm = `${btnBase} text-xs border-white/[0.14] bg-white/[0.04] text-white/85 hover:bg-white/[0.09] hover:border-white/[0.24] h-auto gap-1 px-4 py-2`;

export const htmlButtonPill = `${btnBase} text-xs border-transparent bg-transparent h-auto gap-1 px-4 py-2 text-mist hover:text-white [&.active]:bg-cyan [&.active]:text-void`;

/** app.js toggluje `.active` na přepínači Pro firmy / Pro tvůrce */
export const audienceSwitcherActive =
  "[&.active]:border-transparent [&.active]:bg-cyan [&.active]:text-void";

/** Pole formuláře v landing sekcích */
export const fieldControl =
  "w-full min-w-0 rounded-sm border border-white/[0.09] bg-white/[0.065] text-sm text-white transition-all duration-200 placeholder:text-white/40 outline-none focus-visible:border-magenta/30 focus-visible:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-magenta/40 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-white/[0.03] disabled:opacity-50 aria-invalid:border-destructive/50 aria-invalid:ring-2 aria-invalid:ring-destructive/35 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white";

export const fieldLabel =
  "block font-body text-[11px] font-medium uppercase tracking-wide text-mist";

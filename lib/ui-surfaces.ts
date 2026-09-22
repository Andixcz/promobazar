/** Sdílené Tailwind třídy pro landing (React + app.js — drž v sync u tlačítek). */

export const section = "px-5 md:px-8 py-16 md:py-12";
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

/** app.js toggluje `.active` na subtabs job boardu; audience přepínač řídí React (pathname). */
export const audienceSwitcherActive =
  "[&.active]:border-transparent [&.active]:bg-cyan [&.active]:text-void";

/** Pole formuláře v landing sekcích */
export const fieldControl =
  "w-full min-w-0 rounded-sm border border-white/[0.09] bg-white/[0.065] text-sm text-white transition-all duration-200 placeholder:text-white/40 outline-none focus:border-cyan/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] focus-visible:border-cyan/40 focus-visible:bg-white/[0.12] focus-visible:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-white/[0.03] disabled:opacity-50 aria-invalid:border-destructive/50 aria-invalid:ring-2 aria-invalid:ring-destructive/35 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white";

/** Stejná výška jako `Input` (default size). */
export const fieldControlSizeDefault = "h-auto px-4 py-3";

export const fieldControlSizeSm = "h-auto px-3 py-2.5";

/** React `FieldSelect` — stejný box jako Input, chování jako hero dropdown. */
export const fieldSelectTrigger = `${fieldControl} ${fieldControlSizeDefault} dd-trigger flex cursor-pointer items-center justify-between gap-2 text-left font-medium shadow-none backdrop-blur-[10px] hover:bg-white/[0.09] [.open_&]:border-cyan/40 [.open_&]:bg-white/[0.12] [.open_&]:shadow-[0_0_0_2px_rgba(0,229,255,0.4)]`;

export const fieldLabel =
  "block font-body text-[11px] font-medium uppercase tracking-wide text-mist";

/** Custom dropdown (hero filtry, formuláře) — drž v sync s `PB_DD_*` v public/app.js */
export const dropdownTrigger =
  "dd-trigger flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-sm border border-white/[0.09] bg-white/[0.065] px-3 py-2 text-left text-sm font-medium text-white shadow-none backdrop-blur-[10px] transition-all duration-200 hover:bg-white/[0.09] focus-visible:border-cyan/40 focus-visible:bg-white/[0.12] focus-visible:shadow-[0_0_0_2px_rgba(0,229,255,0.4)] focus-visible:outline-none [.open_&]:border-cyan/40 [.open_&]:bg-white/[0.12] [.open_&]:shadow-[0_0_0_2px_rgba(0,229,255,0.4)]";

const dropdownPanelBase =
  "dd-panel absolute top-[calc(100%+6px)] z-[100] max-h-[280px] overflow-y-auto rounded-sm border border-white/[0.12] bg-dd-panel p-1 space-y-0.5 opacity-0 pointer-events-none -translate-y-1 scale-[0.99] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)] transition-all duration-200 [&.open]:pointer-events-auto [&.open]:translate-y-0 [&.open]:scale-100 [&.open]:opacity-100";

export const dropdownPanel = `${dropdownPanelBase} left-0 right-0`;

export const dropdownPanelNav = `${dropdownPanelBase} right-0 min-w-[190px]`;

export const dropdownOption =
  "dd-option cursor-pointer rounded-sm px-3 py-2 text-sm leading-snug text-white/90 transition-colors duration-150 hover:bg-white/[0.08] [&.active]:bg-white/[0.12] [&.active]:text-white";

/** Aktivní položka v dashboard přepínači (nav, typ účtu). */
export const switcherActive =
  "border-transparent bg-cyan text-void hover:bg-cyan/85";

/** Výchozí avatar bez fotky — iniciály na aqua výplni. */
export const avatarPlaceholder =
  "bg-gradient-to-br from-cyan to-cyan/75 text-void";

export const MARKETPLACE_CATEGORIES = [
  { value: "fitness", label: "Fitness & Health" },
  { value: "fashion", label: "Móda & Beauty" },
  { value: "gaming", label: "Gaming & E-sports" },
  { value: "gastro", label: "Gastro & Jídlo" },
  { value: "tech", label: "Tech & Gadgets" },
  { value: "lifestyle", label: "Lifestyle" },
] as const;

export const PACKAGE_FORMATS = [
  { value: "tiktok", label: "TikTok video" },
  { value: "reel", label: "Instagram Reel" },
  { value: "story", label: "Stories" },
  { value: "youtube", label: "YouTube Short" },
  { value: "ugc", label: "UGC (bez publikace)" },
] as const;

export const PACKAGE_LICENSE_OPTIONS = [
  { value: "30", label: "30 dní" },
  { value: "90", label: "90 dní" },
  { value: "180", label: "180 dní" },
  { value: "365", label: "1 rok" },
] as const;

export const DELIVERY_OPTIONS = [
  { value: 3, label: "3 dny" },
  { value: 7, label: "7 dní" },
  { value: 14, label: "14 dní" },
  { value: 21, label: "21 dní" },
] as const;

export function categoryLabel(value: string | null | undefined): string {
  return (
    MARKETPLACE_CATEGORIES.find((c) => c.value === value)?.label ?? value ?? "—"
  );
}

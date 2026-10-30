import type { FieldSelectOption } from "@/components/ui/field-select";

export const marketplacePlatformOptions: FieldSelectOption[] = [
  { value: "all", label: "Všechny formáty" },
  { value: "ig-story", label: "Instagram Story" },
  { value: "ig-reel", label: "Instagram Reel" },
  { value: "tiktok", label: "TikTok Video" },
  { value: "yt-shorts", label: "YouTube Shorts" },
  { value: "ugc", label: "UGC do reklamy" },
];

export const marketplaceCategoryOptions: FieldSelectOption[] = [
  { value: "all", label: "Všechny obory" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "fashion", label: "Móda & Beauty" },
  { value: "gaming", label: "Gaming & E-sports" },
  { value: "gastro", label: "Gastro & Jídlo" },
  { value: "tech", label: "Tech & Gadgets" },
  { value: "lifestyle", label: "Lifestyle" },
];

export const marketplaceLicenseOptions: FieldSelectOption[] = [
  { value: "all", label: "Jakákoliv délka" },
  { value: "30", label: "30 dní" },
  { value: "60", label: "60 dní" },
  { value: "90", label: "90 dní" },
  { value: "unlimited", label: "Neomezeně" },
];

export type MarketplaceFilters = {
  platform: string;
  category: string;
  license: string;
  budget: number;
};

export const defaultMarketplaceFilters: MarketplaceFilters = {
  platform: "all",
  category: "all",
  license: "all",
  budget: 15_000,
};

/** Veřejný profil tvůrce v landing tržišti (zdroj: později API / DB). */
export type MarketplaceCreator = {
  name: string;
  initials: string;
  category: string;
  categoryLabel: string;
  followers: string;
  reach: string;
  audienceAge: string;
  platforms: string[];
  packages: { name: string; price: number; license?: string }[];
  isPro?: boolean;
  grad?: string;
  avatarUrl?: string | null;
};

/** Zatím prázdné — napojení na DB až v další iteraci. */
export const marketplaceCreators: MarketplaceCreator[] = [];

const platformLabels: Record<string, string> = {
  "ig-story": "IG Story",
  "ig-reel": "IG Reel",
  tiktok: "TikTok",
  "yt-shorts": "YT Shorts",
  ugc: "UGC",
};

export function minCreatorPrice(creator: MarketplaceCreator): number {
  return Math.min(...creator.packages.map((p) => p.price));
}

export function packagesSummary(creator: MarketplaceCreator): string {
  return creator.packages.map((p) => p.name).join(" · ");
}

export function bestLicenseLabel(creator: MarketplaceCreator): string {
  const sorted = [...creator.packages].sort((a, b) => a.price - b.price);
  const license = sorted[0]?.license ?? "30";
  const map: Record<string, string> = {
    "30": "30 dní",
    "60": "60 dní",
    "90": "90 dní",
    unlimited: "Neomezeně",
  };
  return map[license] ?? license;
}

export function platformLabel(key: string): string {
  return platformLabels[key] ?? key;
}

export function filterMarketplaceCreators(
  list: MarketplaceCreator[],
  filters: MarketplaceFilters,
): MarketplaceCreator[] {
  const filtered = list.filter((c) => {
    const platformOk =
      filters.platform === "all" || c.platforms.includes(filters.platform);
    const categoryOk =
      filters.category === "all" || c.category === filters.category;
    const licenseOk =
      filters.license === "all" ||
      c.packages.some((p) => (p.license ?? "30") === filters.license);
    const budgetOk = minCreatorPrice(c) <= filters.budget;
    return platformOk && categoryOk && licenseOk && budgetOk;
  });
  filtered.sort((a, b) => (b.isPro ? 1 : 0) - (a.isPro ? 1 : 0));
  return filtered;
}

export function marketplaceCreatorPlural(n: number): string {
  if (n === 1) return "tvůrce";
  if (n >= 2 && n <= 4) return "tvůrci";
  return "tvůrců";
}

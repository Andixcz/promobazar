"use client";

import type { SimpleIcon as SimpleIconData } from "simple-icons";
import { siInstagram, siTiktok, siYoutube } from "simple-icons/icons";

import { SimpleIcon } from "@/components/auth/simple-icon";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { categoryLabel } from "@/lib/dashboard/categories";
import { profileInitials } from "@/lib/dashboard/profile-display";
import type {
  DashboardBadge,
  MemberProfileRow,
} from "@/lib/dashboard/profile-types";
import { avatarPlaceholder, profileBannerAspect, profileBannerPlaceholder, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type ProfileMarketplacePreviewProps = {
  profile: MemberProfileRow;
  email: string;
  badges: DashboardBadge[];
  displayName: string;
  bio: string;
  category: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  socialTiktok?: string;
  socialInstagram?: string;
  socialYoutube?: string;
};

export function ProfileMarketplacePreview({
  profile,
  email,
  badges,
  displayName,
  bio,
  category,
  avatarUrl,
  bannerUrl,
  socialTiktok,
  socialInstagram,
  socialYoutube,
}: ProfileMarketplacePreviewProps) {
  const name = displayName.trim() || "Tvoje jméno";
  const initials = profileInitials(
    { ...profile, displayName: name },
    email,
  );
  const resolvedAvatar = avatarUrl ?? profile.avatarUrl;
  const resolvedBanner = bannerUrl ?? profile.bannerUrl;

  const socials: { key: string; value: string; icon: SimpleIconData }[] = [
    { key: "tiktok", value: socialTiktok ?? "", icon: siTiktok },
    { key: "instagram", value: socialInstagram ?? "", icon: siInstagram },
    { key: "youtube", value: socialYoutube ?? "", icon: siYoutube },
  ].filter((s) => s.value.trim());

  return (
    <div className={cn(surface, "overflow-hidden")}>
      <p className="border-b border-white/[0.08] px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-mist">
        Náhled v tržišti
      </p>

      <div className={cn("relative shrink-0", profileBannerAspect)}>
        {resolvedBanner ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedBanner}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className={cn("absolute inset-0", profileBannerPlaceholder)} aria-hidden />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-panel via-panel/50 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] px-4 pb-4">
        <div className="-mt-10 mb-3">
          <div
            className={cn(
              "relative size-16 overflow-hidden rounded-full border-2 border-cyan/50 bg-panel ring-4 ring-panel",
              !resolvedAvatar && avatarPlaceholder,
            )}
          >
            {resolvedAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedAvatar}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center font-display text-lg font-bold">
                {initials}
              </span>
            )}
          </div>
        </div>

        <p className="truncate font-display text-base font-semibold leading-tight text-white">
          {name}
        </p>
        <p className="mt-0.5 text-xs text-mist">{categoryLabel(category)}</p>

        {bio.trim() ? (
          <MarkdownContent content={bio} className="mt-3 max-h-24 overflow-hidden break-words" />
        ) : (
          <p className="mt-3 text-sm text-mist">Bez bio</p>
        )}

        {profile.role !== "buyer" && socials.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {socials.map(({ key, value, icon }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-sm border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-200"
              >
                <SimpleIcon
                  icon={icon}
                  className="size-3.5 text-mist"
                  title={icon.title}
                />
                <span className="max-w-[120px] truncate">{value}</span>
              </span>
            ))}
          </div>
        ) : null}

        <p className="mt-4 border-t border-white/[0.08] pt-3 text-[11px] text-mist">
          {badges.filter((b) => b.earned).length} z {badges.length} odznaků
          zobrazeno na profilu
        </p>
      </div>
    </div>
  );
}

"use client";

import { Camera, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { profileInitials } from "@/lib/dashboard/profile-display";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { avatarPlaceholder, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type ProfileMediaHeaderProps = {
  profile: MemberProfileRow;
  email: string;
  displayName: string;
  onMediaChange: (next: { avatarUrl?: string; bannerUrl?: string }) => void;
  onDirty?: () => void;
};

/** ponytail: obrázky jako data URL v DB — pro produkci nahradit object storage (Vercel Blob). */
async function fileToDataUrl(file: File): Promise<string> {
  const maxBytes = 900_000;
  if (file.size > maxBytes) {
    throw new Error("Soubor je příliš velký (max. ~900 KB).");
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Nepodařilo se načíst soubor."));
    reader.readAsDataURL(file);
  });
}

export function ProfileMediaHeader({
  profile,
  email,
  displayName,
  onMediaChange,
  onDirty,
}: ProfileMediaHeaderProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl);
  const [error, setError] = useState<string | null>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);
  const initials = profileInitials(
    { ...profile, displayName: displayName || profile.displayName },
    email,
  );
  const name = displayName.trim() || profile.displayName || "Tvůj profil";

  async function onPick(
    file: File | undefined,
    kind: "avatar" | "banner",
  ) {
    if (!file) return;
    setError(null);
    try {
      const url = await fileToDataUrl(file);
      if (kind === "avatar") {
        setAvatarUrl(url);
        onMediaChange({ avatarUrl: url });
      } else {
        setBannerUrl(url);
        onMediaChange({ bannerUrl: url });
      }
      onDirty?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nahrání selhalo.");
    }
  }

  return (
    <div className={cn(surface, "overflow-hidden")}>
      <div
        className={cn(
          "relative h-36 w-full md:h-40",
          !bannerUrl && "bg-gradient-to-br from-cyan/20 via-panel to-magenta/10",
        )}
        style={
          bannerUrl
            ? { background: `url(${bannerUrl}) center/cover` }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />
        <div className="absolute right-4 top-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/20 bg-void/60 backdrop-blur-sm"
            onClick={() => bannerInput.current?.click()}
          >
            <ImageIcon className="size-4" aria-hidden />
            Banner
          </Button>
        </div>
      </div>
      <input
        ref={bannerInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0], "banner")}
      />

      <div className="relative flex flex-col gap-4 px-5 pb-5 pt-0 md:flex-row md:items-end md:px-6">
        <div className="-mt-10 flex shrink-0 items-end gap-4">
          <button
            type="button"
            onClick={() => avatarInput.current?.click()}
            className="group relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-cyan/50 bg-panel p-0.5 md:size-[88px]"
          >
            <span
              className={cn(
                "flex size-full items-center justify-center rounded-full font-display text-2xl font-bold",
                !avatarUrl && avatarPlaceholder,
              )}
              style={
                avatarUrl
                  ? { background: `url(${avatarUrl}) center/cover` }
                  : undefined
              }
            >
              {avatarUrl ? null : initials}
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition group-hover:opacity-100"
              aria-hidden
            >
              <Camera className="size-5 text-white" />
            </span>
          </button>
          <input
            ref={avatarInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0], "avatar")}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mb-1 md:hidden"
            onClick={() => avatarInput.current?.click()}
          >
            <Camera className="size-4" aria-hidden />
            Foto
          </Button>
        </div>
        <div className="min-w-0 flex-1 pb-1">
          <p className="font-display text-lg font-semibold text-white md:text-xl">
            {name}
          </p>
          <div className="mt-3 hidden gap-2 md:flex">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => avatarInput.current?.click()}
            >
              <Camera className="size-4" aria-hidden />
              Nahrát foto
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => bannerInput.current?.click()}
            >
              <ImageIcon className="size-4" aria-hidden />
              Nahrát banner
            </Button>
          </div>
        </div>
      </div>
      {error ? (
        <p className="px-5 pb-4 text-xs text-error-soft md:px-6" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { Camera, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";

import {
  StorageUnavailableError,
  uploadFileToStorage,
} from "@/lib/storage/upload-file";

import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "@/components/ui/image-crop-dialog";
import { profileInitials } from "@/lib/dashboard/profile-display";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { avatarPlaceholder, profileBannerAspect, profileBannerPlaceholder, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type ProfileMediaHeaderProps = {
  profile: MemberProfileRow;
  email: string;
  displayName: string;
  onMediaChange: (next: { avatarUrl?: string; bannerUrl?: string }) => void;
  onDirty?: () => void;
};

/** ponytail: fallback bez B2 env: jen lokální vývoj. */
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
  const [crop, setCrop] = useState<{ file: File; kind: "avatar" | "banner" } | null>(null);
  const [uploading, setUploading] = useState<"avatar" | "banner" | null>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);
  const initials = profileInitials(
    { ...profile, displayName: displayName || profile.displayName },
    email,
  );
  const name = displayName.trim() || profile.displayName || "Tvůj profil";

  function selectFile(event: React.ChangeEvent<HTMLInputElement>, kind: "avatar" | "banner") {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Použij obrázek JPEG, PNG nebo WebP.");
      return;
    }
    setError(null);
    setCrop({ file, kind });
  }

  async function onPick(
    file: File | undefined,
    kind: "avatar" | "banner",
  ) {
    if (!file) return;
    setError(null);
    setUploading(kind);
    try {
      let url: string;
      try {
        url = await uploadFileToStorage(file, kind);
      } catch (e) {
        if (e instanceof StorageUnavailableError) {
          url = await fileToDataUrl(file);
        } else {
          throw e;
        }
      }
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
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className={cn(surface, "overflow-hidden")}>
      <div
        className={cn(
          "relative", profileBannerAspect,
          !bannerUrl && profileBannerPlaceholder,
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
            disabled={uploading !== null}
          >
            <ImageIcon className="size-4" aria-hidden />
            {uploading === "banner" ? "Nahrávám…" : "Banner"}
          </Button>
        </div>
      </div>
      <input
        ref={bannerInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => selectFile(e, "banner")}
      />

      <div className="relative flex flex-col gap-4 px-5 pb-5 pt-0 md:flex-row md:items-end md:px-6">
        <div className="-mt-10 flex shrink-0 items-end gap-4">
          <button
            type="button"
            aria-label="Změnit profilovou fotku"
            onClick={() => avatarInput.current?.click()}
            disabled={uploading !== null}
            className="group relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-cyan/50 bg-panel p-0.5 disabled:opacity-60 md:size-[88px]"
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
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => selectFile(e, "avatar")}
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
      <ImageCropDialog
        open={crop !== null}
        file={crop?.file ?? null}
        title={crop?.kind === "avatar" ? "Oříznout profilovou fotku" : "Oříznout banner"}
        description={crop?.kind === "avatar" ? "Vyber část fotky, která se zobrazí v profilu." : "Vyber část banneru v poměru 5:2."}
        aspect={crop?.kind === "avatar" ? 1 : 5 / 2}
        circularCrop={crop?.kind === "avatar"}
        preserveTransparency
        onOpenChange={(open) => { if (!open) setCrop(null); }}
        onConfirm={async (file) => {
          if (!crop) return;
          await onPick(file, crop.kind);
          setCrop(null);
        }}
      />
    </div>
  );
}

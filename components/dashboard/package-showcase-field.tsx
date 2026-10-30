"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { PACKAGE_SHOWCASE_MAX } from "@/lib/dashboard/package-media";
import {
  StorageUnavailableError,
  uploadFileToStorage,
} from "@/lib/storage/upload-file";
import { cn } from "@/lib/utils";

type PackageShowcaseFieldProps = {
  showcaseUrls: string[];
  bannerUrl: string | null;
  onChange: (next: { showcaseUrls: string[]; bannerUrl: string | null }) => void;
  disabled?: boolean;
};

export function PackageShowcaseField({
  showcaseUrls,
  bannerUrl,
  onChange,
  disabled,
}: PackageShowcaseFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAdd = showcaseUrls.length < PACKAGE_SHOWCASE_MAX;

  async function onPick(file: File | undefined) {
    if (!file || disabled || !canAdd) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadFileToStorage(file, "package-showcase");
      const nextUrls = [...showcaseUrls, url];
      const nextBanner =
        bannerUrl && nextUrls.includes(bannerUrl) ? bannerUrl : url;
      onChange({ showcaseUrls: nextUrls, bannerUrl: nextBanner });
    } catch (e) {
      setError(
        e instanceof StorageUnavailableError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Nahrání se nepovedlo.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    const nextUrls = showcaseUrls.filter((item) => item !== url);
    let nextBanner = bannerUrl;
    if (bannerUrl === url) {
      nextBanner = nextUrls[0] ?? null;
    } else if (nextBanner && !nextUrls.includes(nextBanner)) {
      nextBanner = nextUrls[0] ?? null;
    }
    onChange({ showcaseUrls: nextUrls, bannerUrl: nextBanner });
  }

  function setBanner(url: string) {
    onChange({ showcaseUrls, bannerUrl: url });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {showcaseUrls.map((url) => {
          const isBanner = bannerUrl === url;
          return (
            <div
              key={url}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-sm border bg-white/[0.03]",
                isBanner ? "border-cyan/45" : "border-white/[0.09]",
              )}
            >
              <img
                src={url}
                alt=""
                className="size-full object-cover"
              />
              {isBanner ? (
                <span
                  className="absolute top-1.5 left-1.5 rounded-sm bg-void/80 px-1.5 py-0.5 text-[10px] font-medium text-cyan"
                >
                  Banner
                </span>
              ) : null}
              <div
                className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-void/90 to-transparent p-1.5 pt-6 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
              >
                {!isBanner ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 flex-1 border-white/20 bg-void/70 px-2 text-[11px]"
                    disabled={disabled}
                    onClick={() => setBanner(url)}
                  >
                    Banner
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="size-7 shrink-0 border-white/20 bg-void/70 p-0"
                  disabled={disabled}
                  onClick={() => remove(url)}
                  aria-label="Odebrat foto"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </Button>
              </div>
            </div>
          );
        })}

        {canAdd ? (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/[0.18] bg-white/[0.02] text-mist transition-colors hover:border-white/[0.28] hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
          >
            <ImagePlus className="size-5" aria-hidden />
            <span className="text-xs font-medium">
              {uploading ? "Nahrávám…" : "Přidat"}
            </span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => onPick(event.target.files?.[0])}
      />

      {error ? (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      ) : null}
    </div>
  );
}

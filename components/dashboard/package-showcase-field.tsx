"use client";

import { Check, GripVertical, ImagePlus, Star, Trash2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
} from "react";

import { ImageCropDialog } from "@/components/ui/image-crop-dialog";
import { PACKAGE_SHOWCASE_MAX } from "@/lib/dashboard/package-media";
import {
  StorageUnavailableError,
  uploadFileToStorage,
} from "@/lib/storage/upload-file";
import { cn } from "@/lib/utils";

/** GIF neprochází canvas ořezem, jen statické formáty. */
const SHOWCASE_ACCEPT = "image/jpeg,image/png,image/webp";

function isRasterShowcaseFile(file: File): boolean {
  if (file.size <= 0) return false;
  if (file.type === "image/gif") return false;
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}

type PackageShowcaseFieldProps = {
  showcaseUrls: string[];
  bannerUrl: string | null;
  onChange: (next: { showcaseUrls: string[]; bannerUrl: string | null }) => void;
  disabled?: boolean;
};

function pickImageFiles(fileList: FileList | null | undefined): File[] {
  if (!fileList?.length) return [];
  return Array.from(fileList).filter(isRasterShowcaseFile);
}

export function PackageShowcaseField({
  showcaseUrls,
  bannerUrl,
  onChange,
  disabled,
}: PackageShowcaseFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const mediaRef = useRef({ showcaseUrls, bannerUrl, onChange });
  mediaRef.current = { showcaseUrls, bannerUrl, onChange };

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileDragActive, setFileDragActive] = useState(false);
  const [reorderOverUrl, setReorderOverUrl] = useState<string | null>(null);
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [cropBatchTotal, setCropBatchTotal] = useState(0);

  const slotsLeft = PACKAGE_SHOWCASE_MAX - showcaseUrls.length;
  const canAdd = slotsLeft > 0;
  const cropActive = cropQueue.length > 0;
  const busy = disabled || uploading;

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(null), 3200);
    return () => window.clearTimeout(timer);
  }, [success]);

  const reorder = useCallback(
    (fromUrl: string, toUrl: string) => {
      if (fromUrl === toUrl) return;
      const fromIdx = showcaseUrls.indexOf(fromUrl);
      const toIdx = showcaseUrls.indexOf(toUrl);
      if (fromIdx < 0 || toIdx < 0) return;
      const next = [...showcaseUrls];
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, fromUrl);
      onChange({ showcaseUrls: next, bannerUrl });
    },
    [bannerUrl, onChange, showcaseUrls],
  );

  const uploadOne = useCallback(async (file: File) => {
    const url = await uploadFileToStorage(file, "package-showcase");
    const { showcaseUrls: urls, bannerUrl: banner, onChange: emit } =
      mediaRef.current;
    const nextUrls = [...urls, url];
    const nextBanner = banner && nextUrls.includes(banner) ? banner : url;
    emit({ showcaseUrls: nextUrls, bannerUrl: nextBanner });
    return url;
  }, []);

  const startCropBatch = useCallback(
    (files: File[]) => {
      if (busy || cropActive || !canAdd) return;
      const raster = files.filter(isRasterShowcaseFile);
      if (!raster.length) {
        setError("Použij JPEG, PNG nebo WebP (ořez 16:9).");
        return;
      }
      const batch = raster.slice(0, slotsLeft);
      if (files.length > batch.length || raster.length > batch.length) {
        setError(
          `Do fronty šlo ${batch.length} souborů, limit ${PACKAGE_SHOWCASE_MAX} fotek nebo nepodporovaný formát.`,
        );
      } else {
        setError(null);
      }
      setCropBatchTotal(batch.length);
      setCropQueue(batch);
      if (inputRef.current) inputRef.current.value = "";
    },
    [busy, canAdd, cropActive, slotsLeft],
  );

  const onCropConfirm = useCallback(
    async (cropped: File) => {
      setUploading(true);
      setUploadProgress({
        done: cropBatchTotal - cropQueue.length + 1,
        total: cropBatchTotal,
      });
      try {
        await uploadOne(cropped);
        setCropQueue((current) => {
          const rest = current.slice(1);
          if (rest.length === 0) {
            setSuccess("Ukázka nahrána. Nezapomeň uložit balíček.");
          } else {
            setSuccess(`Ukázka nahrána (${cropBatchTotal - rest.length}/${cropBatchTotal}).`);
          }
          return rest;
        });
        setError(null);
      } catch (e) {
        setError(
          e instanceof StorageUnavailableError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Nahrání se nepovedlo.",
        );
        setCropQueue([]);
      } finally {
        setUploading(false);
        setUploadProgress(null);
      }
    },
    [cropBatchTotal, cropQueue.length, uploadOne],
  );

  function clearCropSession() {
    setCropQueue([]);
    setCropBatchTotal(0);
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

  function onFileDragEnter(event: ReactDragEvent) {
    if (busy || cropActive || !canAdd) return;
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    dragDepthRef.current += 1;
    setFileDragActive(true);
  }

  function onFileDragLeave(event: ReactDragEvent) {
    if (!fileDragActive) return;
    event.preventDefault();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setFileDragActive(false);
    }
  }

  function onFileDragOver(event: ReactDragEvent) {
    if (busy || cropActive || !canAdd) return;
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function onFileDrop(event: ReactDragEvent) {
    event.preventDefault();
    dragDepthRef.current = 0;
    setFileDragActive(false);
    if (busy || cropActive || !canAdd) return;
    startCropBatch(pickImageFiles(event.dataTransfer.files));
  }

  function onTileDragStart(url: string, event: ReactDragEvent) {
    if (busy) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData("application/x-pb-showcase-url", url);
    event.dataTransfer.effectAllowed = "move";
  }

  function onTileDragOver(url: string, event: ReactDragEvent) {
    if (event.dataTransfer.types.includes("Files")) return;
    if (!event.dataTransfer.types.includes("application/x-pb-showcase-url")) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setReorderOverUrl(url);
  }

  function onTileDrop(url: string, event: ReactDragEvent) {
    if (event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    event.stopPropagation();
    const fromUrl = event.dataTransfer.getData("application/x-pb-showcase-url");
    setReorderOverUrl(null);
    if (fromUrl) reorder(fromUrl, url);
  }

  const uploadLabel =
    uploadProgress && uploadProgress.total > 1
      ? `Nahrávám ${uploadProgress.done}/${uploadProgress.total}…`
      : uploading
        ? "Nahrávám…"
        : "Přidat";

  const cropIndex =
    cropBatchTotal > 0 ? cropBatchTotal - cropQueue.length + 1 : 1;

  return (
    <div className="space-y-3">
      <p className="text-xs text-mist">
        {showcaseUrls.length} / {PACKAGE_SHOWCASE_MAX} · poměr 16:9
      </p>

      <div
        className={cn(
          "rounded-lg border border-transparent p-1 transition-colors",
          fileDragActive && canAdd && "border-cyan/40 bg-cyan/[0.06]",
        )}
        onDragEnter={onFileDragEnter}
        onDragLeave={onFileDragLeave}
        onDragOver={onFileDragOver}
        onDrop={onFileDrop}
      >
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {showcaseUrls.map((url) => {
            const isBanner = bannerUrl === url;
            const isReorderTarget = reorderOverUrl === url;
            return (
              <div
                key={url}
                className={cn(
                  "group overflow-hidden rounded-md border bg-white/[0.03]",
                  isBanner ? "border-cyan/45" : "border-white/[0.09]",
                  isReorderTarget && "ring-2 ring-cyan/50",
                )}
                onDragOver={(event) => onTileDragOver(url, event)}
                onDragLeave={() => setReorderOverUrl(null)}
                onDrop={(event) => onTileDrop(url, event)}
              >
                <div className="relative aspect-video overflow-hidden bg-[#0a0910]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="size-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  {isBanner ? (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-sm bg-void/90 px-2 py-0.5 text-[10px] font-medium text-cyan">
                      <Star className="size-3 fill-cyan text-cyan" aria-hidden />
                      Banner
                    </span>
                  ) : null}
                </div>

                <div className="flex items-stretch divide-x divide-white/[0.08] border-t border-white/[0.08] bg-panel/90">
                  <button
                    type="button"
                    draggable={!busy}
                    disabled={busy}
                    aria-label="Přesunout v pořadí"
                    className={cn(
                      "inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 px-2 text-[11px] font-medium text-mist transition-colors hover:bg-white/[0.04] hover:text-white active:cursor-grabbing",
                      !busy && "cursor-grab",
                      busy && "cursor-not-allowed opacity-50",
                    )}
                    onDragStart={(event) => onTileDragStart(url, event)}
                    onDragEnd={() => setReorderOverUrl(null)}
                  >
                    <GripVertical className="size-3.5 shrink-0 opacity-70" aria-hidden />
                    Pořadí
                  </button>
                  {!isBanner ? (
                    <button
                      type="button"
                      disabled={busy}
                      className="inline-flex min-h-9 flex-[1.15] items-center justify-center gap-1 px-2 text-[11px] font-medium text-mist transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
                      onClick={() => setBanner(url)}
                    >
                      <Star className="size-3.5 shrink-0 opacity-70" aria-hidden />
                      Banner
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    aria-label="Odebrat foto"
                    className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 px-2 text-[11px] font-medium text-red-300/90 transition-colors hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
                    onClick={() => remove(url)}
                  >
                    <Trash2 className="size-3.5 shrink-0 opacity-80" aria-hidden />
                    Odebrat
                  </button>
                </div>
              </div>
            );
          })}

          {canAdd ? (
            <button
              type="button"
              disabled={busy || cropActive}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex aspect-video flex-col items-center justify-center gap-1.5 rounded-md border border-dashed px-2 text-center transition-colors disabled:opacity-50",
                fileDragActive
                  ? "border-cyan/50 bg-cyan/[0.08] text-white"
                  : "border-white/[0.18] bg-white/[0.02] text-mist hover:border-white/[0.28] hover:bg-white/[0.04] hover:text-white",
              )}
            >
              <ImagePlus className="size-5 shrink-0" aria-hidden />
              <span className="text-xs font-medium">{uploadLabel}</span>
              <span className="text-[10px] leading-snug text-mist">
                16:9 · přetáhni nebo vyber
              </span>
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={SHOWCASE_ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => {
          startCropBatch(pickImageFiles(event.target.files));
        }}
      />

      <ImageCropDialog
        open={cropActive}
        file={cropQueue[0] ?? null}
        onOpenChange={(open) => {
          if (!open) clearCropSession();
        }}
        onConfirm={onCropConfirm}
        queueHint={
          cropBatchTotal > 1
            ? `Soubor ${cropIndex} z ${cropBatchTotal}`
            : undefined
        }
      />

      {success ? (
        <p
          className="flex items-center gap-2 text-xs font-medium text-cyan"
          role="status"
        >
          <Check className="size-3.5 shrink-0" aria-hidden />
          {success}
        </p>
      ) : null}

      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

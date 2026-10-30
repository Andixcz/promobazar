"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactCrop, {
  convertToPixelCrop,
  cropToCanvas,
  type Crop,
  type PixelCrop,
} from "react-image-crop";

import { Button } from "@/components/ui/button";
import {
  SHOWCASE_ASPECT,
  blobToUploadFile,
  maxAspectCrop,
} from "@/lib/ui/image-crop-export";
import { glassPanel } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

import "react-image-crop/dist/ReactCrop.css";

type ImageCropDialogProps = {
  open: boolean;
  file: File | null;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (file: File) => void | Promise<void>;
  queueHint?: string;
  aspect?: number;
  circularCrop?: boolean;
  preserveTransparency?: boolean;
};

export function ImageCropDialog({
  open,
  file,
  title = "Ořezat obrázek",
  description = "Formát 16:9, stejný poměr jako v galerii balíčku.",
  confirmLabel = "Použít ořez",
  onOpenChange,
  onConfirm,
  queueHint,
  aspect = SHOWCASE_ASPECT,
  circularCrop = false,
  preserveTransparency = false,
}: ImageCropDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [mounted, setMounted] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const [imageReady, setImageReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullDescription = queueHint
    ? `${description} (${queueHint})`
    : description;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !file) {
      setCrop(undefined);
      setPixelCrop(undefined);
      setImageReady(false);
      setError(null);
      setBusy(false);
      setObjectUrl(null);
      return;
    }

    setImageReady(false);
    setError(null);
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || busy) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, onOpenChange, open]);

  const onImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      const width = image.offsetWidth;
      const height = image.offsetHeight;
      if (!width || !height) return;
      const nextCrop = maxAspectCrop(width, height, aspect);
      setCrop(nextCrop);
      setPixelCrop(convertToPixelCrop(nextCrop, width, height));
      setImageReady(true);
    },
    [aspect],
  );

  async function handleConfirm() {
    const image = imgRef.current;
    if (!image || !file || !crop) return;

    const pixels =
      pixelCrop?.width && pixelCrop.height
        ? pixelCrop
        : convertToPixelCrop(crop, image.width, image.height);
    if (!pixels.width || !pixels.height) {
      setError("Vyber oblast ořezu.");
      return;
    }
    if (!image.naturalWidth || !image.naturalHeight) {
      setError("Obrázek se nepodařilo načíst, zkus jiný soubor.");
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const canvas = document.createElement("canvas");
      await cropToCanvas(image, canvas, pixels);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (!result) {
              reject(new Error("Ořez se nepovedl."));
              return;
            }
            resolve(result);
          },
          preserveTransparency && file.type === "image/png" ? "image/png" : "image/jpeg",
          0.92,
        );
      });
      const cropped = blobToUploadFile(blob, file.name, aspect === SHOWCASE_ASPECT ? "16x9" : "crop");
      await onConfirm(cropped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ořez se nepovedl.");
    } finally {
      setBusy(false);
    }
  }

  if (!mounted || !open || !file) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[250] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-crop-title"
      aria-describedby="image-crop-desc"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(4,3,8,0.78)] backdrop-blur-[6px]"
        aria-label="Zrušit ořez"
        disabled={busy}
        onClick={() => onOpenChange(false)}
      />

      <div
        className={cn(
          glassPanel,
          "relative z-10 flex max-h-[min(92vh,44rem)] w-full max-w-2xl flex-col gap-4 overflow-hidden p-5 sm:p-6",
        )}
      >
        <div className="min-w-0 pr-8">
          <h2
            id="image-crop-title"
            className="font-display text-xl font-bold tracking-tight text-white"
          >
            {title}
          </h2>
          <p id="image-crop-desc" className="mt-1.5 text-sm text-zinc-200">
            {fullDescription}
          </p>
        </div>

        <div className="relative min-h-48 min-h-0 flex-1 overflow-auto rounded-md border border-white/[0.09] bg-black/50 p-2">
          {objectUrl ? (
            <div className="flex justify-center">
              <ReactCrop
                key={`${file.name}-${file.size}-${file.lastModified}`}
                crop={crop}
                aspect={aspect}
                circularCrop={circularCrop}
                ruleOfThirds
                keepSelection
                className="inline-block max-w-full"
                onChange={(nextPixel, percentCrop) => {
                  setCrop(percentCrop);
                  setPixelCrop(nextPixel);
                }}
                onComplete={(nextPixel, percentCrop) => {
                  setCrop(percentCrop);
                  setPixelCrop(nextPixel);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={objectUrl}
                  alt=""
                  className="block max-h-[min(50vh,24rem)] max-w-full h-auto w-auto"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          ) : (
            <p className="p-6 text-center text-sm text-mist">Načítám náhled…</p>
          )}
          {objectUrl && !imageReady ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-mist">
              Načítám náhled…
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Zrušit
          </Button>
          <Button
            type="button"
            disabled={busy || !imageReady || !crop}
            onClick={() => void handleConfirm()}
          >
            {busy ? "Nahrávám…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

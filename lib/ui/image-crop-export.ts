import {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";

const MIME = "image/jpeg";
const QUALITY = 0.92;

export const SHOWCASE_ASPECT = 16 / 9;

/** Největší výběr 16:9, který se vejde do zobrazeného obrázku (bez okrajů). */
export function maxAspectCrop(
  containerWidth: number,
  containerHeight: number,
  aspect: number = SHOWCASE_ASPECT,
): Crop {
  if (!containerWidth || !containerHeight) {
    return { unit: "%", x: 0, y: 0, width: 100, height: 100 / aspect };
  }

  const mediaAspect = containerWidth / containerHeight;

  if (mediaAspect > aspect) {
    return centerCrop(
      makeAspectCrop(
        { unit: "%", height: 100 },
        aspect,
        containerWidth,
        containerHeight,
      ),
      containerWidth,
      containerHeight,
    );
  }

  return centerCrop(
    makeAspectCrop(
      { unit: "%", width: 100 },
      aspect,
      containerWidth,
      containerHeight,
    ),
    containerWidth,
    containerHeight,
  );
}

export function canvasCropToBlob(
  image: HTMLImageElement,
  crop: PixelCrop,
): Promise<Blob> {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const width = Math.max(1, Math.floor(crop.width * scaleX));
  const height = Math.max(1, Math.floor(crop.height * scaleY));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(new Error("Canvas není k dispozici."));
  }
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    width,
    height,
    0,
    0,
    width,
    height,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Ořez se nepovedl."));
          return;
        }
        resolve(blob);
      },
      MIME,
      QUALITY,
    );
  });
}

export function blobToUploadFile(blob: Blob, originalName: string, suffix = "16x9"): File {
  const base = originalName.replace(/\.[^.]+$/, "") || "showcase";
  const extension = blob.type === "image/png" ? "png" : "jpg";
  return new File([blob], `${base}-${suffix}.${extension}`, { type: blob.type || MIME });
}

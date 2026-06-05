const MAX_BYTES = 600_000;

export interface ProcessImageOptions {
  /** Target width:height ratio (default 16:9). */
  aspectRatio?: number;
  /** Max width in pixels after crop (height derived from aspect). */
  maxWidth?: number;
}

/** Center-crop and compress an image to a JPEG data URL for localStorage. */
export async function processImageFile(
  file: File,
  options: ProcessImageOptions = {},
): Promise<string> {
  const aspectRatio = options.aspectRatio ?? 16 / 9;
  const maxWidth = options.maxWidth ?? 854;

  const bitmap = await createImageBitmap(file);
  const srcW = bitmap.width;
  const srcH = bitmap.height;
  const srcAspect = srcW / srcH;

  let cropW = srcW;
  let cropH = srcH;
  let sx = 0;
  let sy = 0;

  if (srcAspect > aspectRatio) {
    cropW = Math.round(srcH * aspectRatio);
    sx = Math.floor((srcW - cropW) / 2);
  } else if (srcAspect < aspectRatio) {
    cropH = Math.round(srcW / aspectRatio);
    sy = Math.floor((srcH - cropH) / 2);
  }

  const outW = Math.min(maxWidth, cropW);
  const outH = Math.round(outW / aspectRatio);

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(bitmap, sx, sy, cropW, cropH, 0, 0, outW, outH);
  bitmap.close();

  let quality = 0.85;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  while (dataUrl.length > MAX_BYTES && quality > 0.35) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }
  if (dataUrl.length > MAX_BYTES) {
    throw new Error('Image is too large — try a smaller file.');
  }
  return dataUrl;
}

export function aspectRatioLabel(ratio: number): string {
  if (Math.abs(ratio - 16 / 9) < 0.01) return '16:9';
  if (Math.abs(ratio - 1) < 0.01) return '1:1';
  return `${ratio.toFixed(2)}:1`;
}

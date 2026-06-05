import { useRef, useState } from 'react';

const MAX_BYTES = 600_000;

interface Props {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

/** Resize and compress an image file to a JPEG data URL for localStorage. */
async function processImageFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxDim = 640;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(bitmap, 0, 0, w, h);
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

export default function ShipImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const pick = () => inputRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG, WebP, etc.).');
      return;
    }
    try {
      setError(null);
      const dataUrl = await processImageFile(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process image.');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display text-[11px] tracking-widest text-slate-300 shrink-0">
          SHIP PORTRAIT
        </span>
        {value && (
          <button
            type="button"
            className="btn btn-danger !py-0.5 !px-2 !text-[10px]"
            onClick={() => onChange(null)}
          >
            Remove
          </button>
        )}
      </div>

      <p className="text-slate-500 text-[10px] font-mono-hud">
        Upload a picture of your ship for the read-only view page. Registry emblems are
        chosen separately on My Ships.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />

      {value ? (
        <div className="panel p-2 flex flex-col sm:flex-row gap-3 items-center">
          <img
            src={value}
            alt="Ship portrait preview"
            className="max-h-40 max-w-full rounded-sm border border-cyan/40 object-contain"
          />
          <button type="button" className="btn btn-amber !text-[10px]" onClick={pick}>
            Replace Image
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          className="w-full panel border-dashed border-slate-600 hover:border-cyan/50 p-6 text-center transition-colors"
        >
          <span className="font-display text-sm text-slate-400 tracking-wider">
            + Upload Ship Image
          </span>
          <p className="font-mono-hud text-[10px] text-slate-500 mt-1">PNG, JPG, or WebP</p>
        </button>
      )}

      {error && <p className="text-danger text-xs font-mono-hud">{error}</p>}
    </div>
  );
}

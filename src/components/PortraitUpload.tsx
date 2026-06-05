import { useRef, useState } from 'react';
import { aspectRatioLabel, processImageFile } from '../lib/imageUpload';

interface Props {
  label: string;
  hint: string;
  value: string | null | undefined;
  onChange: (dataUrl: string | null) => void;
  aspectRatio?: number;
  maxWidth?: number;
  compact?: boolean;
  uploadPrompt?: string;
}

export default function PortraitUpload({
  label,
  hint,
  value,
  onChange,
  aspectRatio = 16 / 9,
  maxWidth = 854,
  compact = false,
  uploadPrompt,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const ratioLabel = aspectRatioLabel(aspectRatio);

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
      const dataUrl = await processImageFile(file, { aspectRatio, maxWidth });
      onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process image.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display text-[10px] tracking-widest text-slate-400 shrink-0">
          {label}
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

      {!compact && (
        <p className="text-slate-500 text-[10px] font-mono-hud leading-relaxed">{hint}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />

      {value ? (
        <div className="flex flex-wrap items-center gap-2">
          <img
            src={value}
            alt=""
            className={`media-clean rounded-sm border border-cyan/40 object-cover ${
              aspectRatio >= 1
                ? compact
                  ? 'w-16 h-16'
                  : 'w-32 aspect-square max-w-full'
                : compact
                  ? 'w-24'
                  : 'w-full max-w-xs aspect-video'
            }`}
            style={aspectRatio >= 1 && !compact ? { aspectRatio: `${aspectRatio}` } : undefined}
          />
          <button type="button" className="btn !text-[10px] !py-0.5 !px-2" onClick={pick}>
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          className={`w-full panel border-dashed border-slate-600 hover:border-cyan/50 text-center transition-colors ${
            compact ? 'p-2' : 'p-4'
          }`}
        >
          <span className="font-display text-[10px] text-slate-400 tracking-wider">
            {uploadPrompt ?? '+ Upload Portrait'}
          </span>
          <p className="font-mono-hud text-[9px] text-slate-500 mt-1">
            Cropped to {ratioLabel} · PNG, JPG, or WebP
          </p>
        </button>
      )}

      {error && <p className="text-danger text-[10px] font-mono-hud">{error}</p>}
    </div>
  );
}

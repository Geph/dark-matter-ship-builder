import { useState } from 'react';
import { gameIconUrl } from '../lib/gameIcons';

interface Props {
  iconId: string | null | undefined;
  className?: string;
  alt?: string;
}

/**
 * Renders a game-icons.net emblem using the original SVG.
 * We keep the white-on-black square so the glyph is always visible,
 * even if CSS masking / filters behave inconsistently.
 */
export default function ShipIcon({ iconId, className = 'w-8 h-8', alt = '' }: Props) {
  const src = gameIconUrl(iconId);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-sm border border-slate-600 bg-void/60 text-slate-500 font-mono-hud text-[9px] ${className}`}
        title={failed ? 'Icon failed to load' : undefined}
        aria-hidden={!alt}
      >
        ?
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? ''}
      className={`game-icon ${className}`}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

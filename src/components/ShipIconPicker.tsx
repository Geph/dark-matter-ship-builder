import { useEffect, useMemo, useState } from 'react';
import ShipIcon from './ShipIcon';
import {
  loadGameIconManifest,
  type GameIconEntry,
  type GameIconManifest,
} from '../lib/gameIcons';

interface Props {
  value: string | null;
  onChange: (iconId: string | null) => void;
}

type FilterMode = 'featured' | 'all';

export default function ShipIconPicker({ value, onChange }: Props) {
  const [manifest, setManifest] = useState<GameIconManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<FilterMode>('featured');

  useEffect(() => {
    loadGameIconManifest()
      .then(setManifest)
      .catch(() => setError('Could not load icon library.'));
  }, []);

  const pool = useMemo(() => {
    if (!manifest) return [] as GameIconEntry[];
    if (mode === 'featured') {
      const featured = new Set(manifest.featuredIds);
      return manifest.icons.filter((i) => featured.has(i.id));
    }
    return manifest.icons;
  }, [manifest, mode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.name.includes(q) ||
        i.author.includes(q) ||
        i.id.includes(q),
    );
  }, [pool, query]);

  const displayed = useMemo(() => {
    if (mode === 'all' && !query.trim()) {
      return filtered.slice(0, 120);
    }
    return filtered;
  }, [filtered, mode, query]);

  if (error) {
    return <p className="text-danger text-sm">{error}</p>;
  }

  if (!manifest) {
    return <p className="text-slate-500 text-sm font-mono-hud">Loading icon library…</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display text-[11px] tracking-widest text-slate-300 shrink-0">
          VESSEL EMBLEM
        </span>
        {value && (
          <button
            type="button"
            className="btn btn-danger !py-0.5 !px-2 !text-[10px]"
            onClick={() => onChange(null)}
          >
            Clear
          </button>
        )}
      </div>

      {value && (
        <div className="flex items-center gap-3 panel p-2">
          <ShipIcon iconId={value} className="w-10 h-10" alt="Selected emblem" />
          <div className="font-mono-hud text-[11px] text-slate-400">
            <span className="text-cyan">{value.replace('/', ' / ')}</span>
            <p className="text-slate-500 text-[10px] mt-0.5">
              by {value.split('/')[0]} · game-icons.net
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons…"
          className="flex-1 min-w-[160px] text-sm"
        />
        <button
          type="button"
          className={`btn !py-1 !px-3 !text-[10px] ${mode === 'featured' ? 'btn-solid' : ''}`}
          onClick={() => setMode('featured')}
        >
          Ship & Space ({manifest.featuredIds.length})
        </button>
        <button
          type="button"
          className={`btn !py-1 !px-3 !text-[10px] ${mode === 'all' ? 'btn-solid' : ''}`}
          onClick={() => setMode('all')}
        >
          All ({manifest.icons.length})
        </button>
      </div>

      <p className="text-slate-500 text-[10px] font-mono-hud">
        Icons from{' '}
        <a
          href="https://game-icons.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-cyan"
        >
          game-icons.net
        </a>{' '}
        (CC BY 3.0). Credit the author when sharing artwork.
      </p>

      <div
        className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto scrollbar-hud panel p-2"
        role="listbox"
        aria-label="Ship emblem icons"
      >
        {displayed.length === 0 ? (
          <p className="col-span-full text-slate-500 text-xs text-center py-4">No icons match.</p>
        ) : (
          displayed.map((icon) => {
            const selected = value === icon.id;
            return (
              <button
                key={icon.id}
                type="button"
                title={`${icon.label} (${icon.author})`}
                onClick={() => onChange(icon.id)}
                className={`aspect-square rounded-sm border p-1.5 flex items-center justify-center transition-all hover:border-cyan/70 hover:bg-cyan/5 ${
                  selected
                    ? 'border-cyan bg-cyan/15 shadow-[0_0_10px_#00e5ff55]'
                    : 'border-slate-700 bg-void/40'
                }`}
              >
                <ShipIcon iconId={icon.id} className="w-full h-full" alt={icon.label} />
              </button>
            );
          })
        )}
      </div>

      <p className="text-slate-600 text-[10px] font-mono-hud">
        Showing {displayed.length} icon{displayed.length !== 1 ? 's' : ''}
        {mode === 'all' && !query.trim() && filtered.length > displayed.length
          ? ` (search to browse all ${filtered.length.toLocaleString()})`
          : filtered.length !== displayed.length
            ? ` of ${filtered.length.toLocaleString()}`
            : ''}
      </p>
    </div>
  );
}

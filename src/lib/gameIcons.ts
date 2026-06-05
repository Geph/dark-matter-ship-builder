// ============================================================
// game-icons.net ship emblem helpers (CC BY 3.0).
// ============================================================

export const GAME_ICONS_BASE = '/game-icons/icons/ffffff/000000/1x1';
export const DEFAULT_SHIP_ICON_ID = 'delapouite/spaceship';

export interface GameIconEntry {
  id: string;
  author: string;
  name: string;
  label: string;
  featured?: boolean;
}

export interface GameIconManifest {
  basePath: string;
  credit: string;
  license: string;
  icons: GameIconEntry[];
  featuredIds: string[];
}

let manifestCache: GameIconManifest | null = null;

export async function loadGameIconManifest(): Promise<GameIconManifest> {
  if (manifestCache) return manifestCache;
  const res = await fetch('/game-icons/manifest.json');
  if (!res.ok) throw new Error('Failed to load game icon manifest');
  manifestCache = (await res.json()) as GameIconManifest;
  return manifestCache;
}

/** Public URL for a stored icon id (`author/icon-name`). */
export function gameIconUrl(iconId: string | null | undefined): string | null {
  if (!iconId) return null;
  return `${GAME_ICONS_BASE}/${iconId}.svg`;
}

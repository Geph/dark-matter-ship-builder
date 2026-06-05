// ============================================================
// game-icons.net ship emblem helpers (CC BY 3.0).
// ============================================================

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

export const DEFAULT_SHIP_ICON_ID = 'delapouite/spaceship';

/** Resolve a public asset path against the Vite base URL. */
export function publicAssetUrl(relativePath: string): string {
  const base = import.meta.env.BASE_URL;
  const normalized = relativePath.replace(/^\//, '');
  return `${base}${normalized}`;
}

export const GAME_ICONS_BASE = publicAssetUrl('game-icons/icons/ffffff/000000/1x1');

let manifestCache: GameIconManifest | null = null;

/** Icon manifest bundled at build time (lazy-loaded, no runtime fetch). */
export async function loadGameIconManifest(): Promise<GameIconManifest> {
  if (!manifestCache) {
    const mod = await import('../data/game-icons-manifest');
    manifestCache = mod.gameIconManifest as GameIconManifest;
  }
  return manifestCache;
}

/** Public URL for a stored icon id (`author/icon-name`). */
export function gameIconUrl(iconId: string | null | undefined): string | null {
  if (!iconId) return null;
  return `${GAME_ICONS_BASE}/${iconId}.svg`;
}

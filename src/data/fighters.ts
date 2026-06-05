import type { FighterBaySlot, FighterType, ShipWeapon } from '../lib/types';

// ============================================================
// Fighter-class hulls (Dark Matter Sci-Fi 5E ship catalog).
// ============================================================

export const FIGHTER_SLOT_COUNT = 6;

export interface FighterHullDef {
  id: string;
  name: string;
  subtitle: string;
  ac: number;
  mhp: number;
  speed: number;
  maneuverability: number;
  cost: number;
  trait?: string;
  defaultWeapons: ShipWeapon[];
}

/** Full fighter classification table (p.130+). */
export const FIGHTER_CATALOG: FighterHullDef[] = [
  {
    id: 'battle-frame',
    name: 'Battle Frame',
    subtitle: 'Human walker-frame',
    ac: 14,
    mhp: 30,
    speed: 3000,
    maneuverability: 360,
    cost: 5750,
    defaultWeapons: [],
  },
  {
    id: 'cog',
    name: 'Cog',
    subtitle: 'Gnome fighter',
    ac: 13,
    mhp: 34,
    speed: 3000,
    maneuverability: 180,
    cost: 5750,
    defaultWeapons: [],
  },
  {
    id: 'drone',
    name: 'Drone',
    subtitle: 'Vect fighter',
    ac: 13,
    mhp: 22,
    speed: 3500,
    maneuverability: 360,
    cost: 4500,
    trait:
      'Auto-Assault. Volatile Design — explodes for 4d6 mega fire when destroyed.',
    defaultWeapons: [
      { name: 'Auto Turret', facing: 'Turret' },
      { name: 'Auto Turret', facing: 'Turret' },
    ],
  },
  {
    id: 'flying-car',
    name: 'Flying Car',
    subtitle: 'Misc. fighter',
    ac: 10,
    mhp: 2,
    speed: 2000,
    maneuverability: 180,
    cost: 3500,
    defaultWeapons: [],
  },
  {
    id: 'hammer',
    name: 'Hammer',
    subtitle: 'Dwarven fighter',
    ac: 14,
    mhp: 25,
    speed: 3000,
    maneuverability: 180,
    cost: 5000,
    defaultWeapons: [],
  },
  {
    id: 'hovertank',
    name: 'Hovertank',
    subtitle: 'Misc. fighter',
    ac: 14,
    mhp: 30,
    speed: 500,
    maneuverability: 180,
    cost: 5000,
    defaultWeapons: [],
  },
  {
    id: 'interceptor',
    name: 'Interceptor',
    subtitle: 'Elven fighter',
    ac: 13,
    mhp: 25,
    speed: 4000,
    maneuverability: 180,
    cost: 5000,
    trait:
      'Nimble Design. On any turn this ship does not fire its weapons, its speed increases by 1,000 ft. for that turn.',
    defaultWeapons: [{ name: 'Pulse Cannon', facing: 'Forward' }],
  },
  {
    id: 'landrunner',
    name: 'Landrunner',
    subtitle: 'Misc. fighter',
    ac: 10,
    mhp: 3,
    speed: 2500,
    maneuverability: 180,
    cost: 2500,
    defaultWeapons: [],
  },
  {
    id: 'kill-rig',
    name: 'Kill-Rig',
    subtitle: 'Orcish fighter',
    ac: 13,
    mhp: 28,
    speed: 3000,
    maneuverability: 180,
    cost: 4000,
    trait:
      'Industrial Design. Resistance to damage from attacks that hit it in the front.',
    defaultWeapons: [
      { name: 'Light Cannon', facing: 'Forward' },
      { name: 'Rip-Chain', facing: 'Port' },
    ],
  },
  {
    id: 'pilgrim',
    name: 'Pilgrim',
    subtitle: 'Avia-Ra fighter',
    ac: 13,
    mhp: 25,
    speed: 3500,
    maneuverability: 180,
    cost: 5000,
    defaultWeapons: [],
  },
  {
    id: 'pincer',
    name: 'Pincer',
    subtitle: 'Nautilid fighter',
    ac: 14,
    mhp: 30,
    speed: 3500,
    maneuverability: 180,
    cost: 5500,
    defaultWeapons: [],
  },
  {
    id: 'probe',
    name: 'Probe',
    subtitle: 'Misc. scout fighter',
    ac: 8,
    mhp: 1,
    speed: 1500,
    maneuverability: 360,
    cost: 2750,
    defaultWeapons: [],
  },
  {
    id: 'sabre',
    name: 'Sabre',
    subtitle: 'Human (Hegemony) fighter',
    ac: 13,
    mhp: 25,
    speed: 3500,
    maneuverability: 180,
    cost: 5000,
    trait: 'Innovative Design. The crew has advantage on initiative rolls.',
    defaultWeapons: [{ name: 'Pulse Cannon', facing: 'Forward' }],
  },
  {
    id: 'saucer',
    name: 'Saucer',
    subtitle: 'Amoeboid fighter',
    ac: 13,
    mhp: 20,
    speed: 3000,
    maneuverability: 180,
    cost: 5750,
    defaultWeapons: [],
  },
  {
    id: 'shuttle',
    name: 'Shuttle',
    subtitle: 'Misc. fighter',
    ac: 10,
    mhp: 2,
    speed: 1500,
    maneuverability: 180,
    cost: 5000,
    defaultWeapons: [],
  },
  {
    id: 'umbra',
    name: 'Umbra',
    subtitle: 'Wrothian fighter',
    ac: 11,
    mhp: 15,
    speed: 3500,
    maneuverability: 180,
    cost: 0,
    defaultWeapons: [],
  },
  {
    id: 'swarmer',
    name: 'Swarmer',
    subtitle: 'Vect swarm fighter (Drone-class)',
    ac: 13,
    mhp: 22,
    speed: 3500,
    maneuverability: 360,
    cost: 4500,
    trait:
      'Auto-Assault. Volatile Design — explodes for 4d6 mega fire when destroyed.',
    defaultWeapons: [
      { name: 'Auto Turret', facing: 'Turret' },
      { name: 'Auto Turret', facing: 'Turret' },
    ],
  },
];

export const FIGHTER_CATALOG_BY_ID: Record<string, FighterHullDef> = Object.fromEntries(
  FIGHTER_CATALOG.map((f) => [f.id, f]),
);

export const FIGHTER_BAY_TYPE_OPTIONS: { id: FighterType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'sabre', label: 'Sabre' },
  { id: 'interceptor', label: 'Interceptor' },
  { id: 'rig', label: 'Rig (Kill-Rig)' },
  { id: 'swarmer', label: 'Swarmer' },
  { id: 'catalog', label: 'Other fighter…' },
];

export function fighterHullIdForBayType(type: FighterType, catalogId: string | null): string | null {
  if (type === 'none' || type === 'catalog') return catalogId;
  if (type === 'rig') return 'kill-rig';
  return type;
}

export function resolveFighterBayHull(bay: FighterBaySlot): FighterHullDef | null {
  if (bay.type === 'none') return null;
  const id = fighterHullIdForBayType(bay.type, bay.catalogId);
  if (!id) return null;
  return FIGHTER_CATALOG_BY_ID[id] ?? null;
}

export function fighterHullById(id: string | null | undefined): FighterHullDef | null {
  if (!id) return null;
  return FIGHTER_CATALOG_BY_ID[id] ?? null;
}

export function fighterDisplayName(bay: FighterBaySlot): string {
  if (bay.type === 'none') return 'Empty Bay';
  const hull = resolveFighterBayHull(bay);
  return hull?.name ?? 'Unknown Fighter';
}

/** @deprecated Use resolveFighterBayHull */
export function fighterPresetFor(type: FighterType): FighterHullDef | null {
  if (type === 'none' || type === 'catalog') return null;
  const id = type === 'rig' ? 'kill-rig' : type;
  return FIGHTER_CATALOG_BY_ID[id] ?? null;
}

// ============================================================
// Core domain types for the Dark Matter Ship Builder.
// ============================================================

export type ShipSize =
  | 'Fighter'
  | 'Personal'
  | 'Transport'
  | 'Corvette'
  | 'Frigate'
  | 'Cruiser'
  | 'Capital';

export type WeaponFacing = 'Forward' | 'Aft' | 'Port' | 'Starboard' | 'Turret';

/** A purchased weapon instance on a ship. */
export interface ShipWeapon {
  /** Matches a weapon `name` in the weapons data. */
  name: string;
  facing: WeaponFacing;
}

/** Fighter craft deployed from a Fighter Bay (Dark Matter ship catalog). */
export type FighterType = 'none' | 'sabre' | 'interceptor' | 'rig' | 'swarmer' | 'catalog';

export interface FighterBaySlot {
  type: FighterType;
  /** Catalog hull id when type is `catalog` (see fighters.ts). */
  catalogId: string | null;
  /** If the bay is populated from a user-saved fighter build, this is that ship id. */
  customShipId: string | null;
  weapons: ShipWeapon[];
}

/** Skill / combat data collected per crew role for in-play rolls. */
export interface CrewMemberData {
  name: string;
  /** Primary skill modifier (Vehicles, Gunnery, Mechanics, etc.). */
  skillModifier: number;
  /** Attack bonus for weapon rolls (typically the Gunner). */
  attackBonus: number;
  /** Mega spells selected for the Gunner (Arcane Cannon, pp. 402–405). */
  megaSpells: string[];
}

/** The full persisted ship record. Mirrors the data-model in the spec. */
export interface Ship {
  id: string;
  userId: string | null;
  name: string;
  /** game-icons.net id: `author/icon-name` — chosen on My Ships. */
  iconId: string | null;
  /** User-uploaded ship portrait (data URL), shown on the view page. */
  shipImageDataUrl: string | null;
  level: number; // 1–20
  players: number; // number of players contributing budget
  /** Build a standalone fighter hull (6 slots, pilot only). */
  isFighterBuild: boolean;
  /** Catalog fighter hull id when `isFighterBuild` (base stats template). */
  fighterHullId: string | null;
  size: ShipSize;
  darkMatterClass: number;
  mhp: number;
  /** Current MHP in play; null means full (equals `mhp`). */
  mhpCurrent: number | null;
  ac: number;
  shieldPoints: number;
  /** Current shield points in play; null means full (equals `shieldPoints`). */
  shieldCurrent: number | null;
  speed: number;
  maneuverability: number;
  totalSlots: number;
  cargo: number;
  passengers: number;
  crewRoles: string[];
  /** Per-role skill and combat data keyed by crew role id. */
  crewMembers: Record<string, CrewMemberData>;
  /** systemId -> installed count (repeatable systems may exceed 1) */
  systems: Record<string, number>;
  weapons: ShipWeapon[];
  /** One entry per installed Fighter Bay; length synced to bay count. */
  fighterBays: FighterBaySlot[];
  /** GM-approved manual credit budget override, or null for level-derived budget. */
  creditBudgetOverride: number | null;
  upgrades: string[];
  /** Upgraded Dark Matter engine class, if the engine was upgraded beyond base. */
  upgradedDmClass: number | null;
  appearance: string;
  condition: string;
  interior: string;
  uniqueTrait: string;
  creditsSpent: number;
  createdAt: string;
  updatedAt: string;
  shareToken: string;
}

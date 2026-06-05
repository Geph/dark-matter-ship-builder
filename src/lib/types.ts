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

/** The full persisted ship record. Mirrors the data-model in the spec. */
export interface Ship {
  id: string;
  userId: string | null;
  name: string;
  level: number; // 1–20
  players: number; // number of players contributing budget
  size: ShipSize;
  darkMatterClass: number;
  mhp: number;
  ac: number;
  shieldPoints: number;
  speed: number;
  maneuverability: number;
  totalSlots: number;
  cargo: number;
  passengers: number;
  crewRoles: string[];
  /** systemId -> installed count (repeatable systems may exceed 1) */
  systems: Record<string, number>;
  weapons: ShipWeapon[];
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

import type { ShipSize } from '../lib/types';

// ============================================================
// Ship Statistics by Level (Dark Matter Sci-Fi 5E, p.218)
// A ship's size and base stats are derived purely from the
// highest character level in the party. These are FACTS from
// the rulebook table — hardcoded here for easy auditing.
// ============================================================

export interface LevelStats {
  level: number;
  size: ShipSize;
  dmClass: number;
  mhp: number;
  ac: number;
  sp: number; // base shield points listed in the table
  speed: number;
  maneuverability: number;
  slots: number;
  cargo: number; // tons
  passengers: number;
}

export const SHIP_STATS_BY_LEVEL: LevelStats[] = [
  { level: 1, size: 'Personal', dmClass: 1, mhp: 20, ac: 14, sp: 8, speed: 3000, maneuverability: 90, slots: 14, cargo: 8, passengers: 4 },
  { level: 2, size: 'Personal', dmClass: 1, mhp: 40, ac: 14, sp: 8, speed: 3000, maneuverability: 90, slots: 15, cargo: 11, passengers: 5 },
  { level: 3, size: 'Personal', dmClass: 1, mhp: 60, ac: 15, sp: 10, speed: 3000, maneuverability: 90, slots: 16, cargo: 17, passengers: 6 },
  { level: 4, size: 'Personal', dmClass: 1, mhp: 80, ac: 15, sp: 10, speed: 3000, maneuverability: 90, slots: 17, cargo: 25, passengers: 7 },
  { level: 5, size: 'Transport', dmClass: 2, mhp: 100, ac: 15, sp: 12, speed: 3000, maneuverability: 90, slots: 18, cargo: 40, passengers: 8 },
  { level: 6, size: 'Transport', dmClass: 2, mhp: 120, ac: 16, sp: 12, speed: 3000, maneuverability: 90, slots: 18, cargo: 55, passengers: 11 },
  { level: 7, size: 'Transport', dmClass: 2, mhp: 140, ac: 16, sp: 12, speed: 3000, maneuverability: 90, slots: 19, cargo: 80, passengers: 15 },
  { level: 8, size: 'Transport', dmClass: 3, mhp: 160, ac: 16, sp: 14, speed: 3000, maneuverability: 90, slots: 20, cargo: 120, passengers: 18 },
  { level: 9, size: 'Transport', dmClass: 3, mhp: 180, ac: 17, sp: 14, speed: 3000, maneuverability: 90, slots: 20, cargo: 180, passengers: 22 },
  { level: 10, size: 'Transport', dmClass: 3, mhp: 200, ac: 17, sp: 14, speed: 3000, maneuverability: 90, slots: 21, cargo: 260, passengers: 25 },
  { level: 11, size: 'Corvette', dmClass: 4, mhp: 220, ac: 17, sp: 16, speed: 3000, maneuverability: 90, slots: 22, cargo: 400, passengers: 30 },
  { level: 12, size: 'Corvette', dmClass: 4, mhp: 240, ac: 18, sp: 16, speed: 3000, maneuverability: 90, slots: 22, cargo: 600, passengers: 45 },
  { level: 13, size: 'Corvette', dmClass: 4, mhp: 260, ac: 18, sp: 16, speed: 3000, maneuverability: 90, slots: 23, cargo: 800, passengers: 60 },
  { level: 14, size: 'Corvette', dmClass: 5, mhp: 280, ac: 18, sp: 18, speed: 3000, maneuverability: 90, slots: 24, cargo: 1000, passengers: 75 },
  { level: 15, size: 'Corvette', dmClass: 5, mhp: 300, ac: 19, sp: 18, speed: 3000, maneuverability: 90, slots: 24, cargo: 2000, passengers: 90 },
  { level: 16, size: 'Corvette', dmClass: 5, mhp: 320, ac: 19, sp: 18, speed: 3000, maneuverability: 90, slots: 25, cargo: 3000, passengers: 105 },
  { level: 17, size: 'Frigate', dmClass: 6, mhp: 340, ac: 19, sp: 20, speed: 3000, maneuverability: 90, slots: 26, cargo: 4000, passengers: 120 },
  { level: 18, size: 'Frigate', dmClass: 6, mhp: 360, ac: 20, sp: 20, speed: 3000, maneuverability: 90, slots: 26, cargo: 6000, passengers: 150 },
  { level: 19, size: 'Frigate', dmClass: 6, mhp: 380, ac: 20, sp: 20, speed: 3000, maneuverability: 90, slots: 27, cargo: 8000, passengers: 180 },
  { level: 20, size: 'Frigate', dmClass: 7, mhp: 400, ac: 20, sp: 20, speed: 3000, maneuverability: 90, slots: 28, cargo: 12000, passengers: 210 },
];

export function statsForLevel(level: number): LevelStats {
  const clamped = Math.max(1, Math.min(20, Math.round(level)));
  return SHIP_STATS_BY_LEVEL[clamped - 1];
}

/** Size ordering used for "size or larger" prerequisite checks. */
export const SIZE_ORDER: ShipSize[] = [
  'Fighter',
  'Personal',
  'Transport',
  'Corvette',
  'Frigate',
  'Cruiser',
  'Capital',
];

export function sizeRank(size: ShipSize): number {
  return SIZE_ORDER.indexOf(size);
}

/** Tactical map footprint by ship classification (p.134, feet). */
export const MAP_SIZE_FEET: Record<ShipSize, string> = {
  Fighter: '<100',
  Personal: '250 × 250',
  Transport: '500 × 500',
  Corvette: '1,000 × 1,000',
  Frigate: '1,500 × 1,500',
  Cruiser: '2,000 × 2,000',
  Capital: '4,000 × 4,000',
};

export function mapSizeFeet(size: ShipSize): string {
  return MAP_SIZE_FEET[size];
}

/** Display dimensions for the ship sheet (override or size default). */
export function shipDimensions(
  size: ShipSize,
  override: string | null | undefined,
): string {
  const trimmed = override?.trim();
  return trimmed ? trimmed : mapSizeFeet(size);
}

/** Shield Points granted by a Shield Generator, by ship size (p.219). */
export const SHIELD_POINTS_BY_SIZE: Record<ShipSize, number> = {
  Fighter: 8,
  Personal: 8,
  Transport: 12,
  Corvette: 16,
  Frigate: 20,
  Cruiser: 24,
  Capital: 28,
};

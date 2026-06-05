import type { ShipSize } from '../lib/types';

// ============================================================
// Ship Upgrades (Dark Matter Sci-Fi 5E, p.220)
// Upgrades cost Credits but DO NOT consume slots.
// Some require a minimum size or a Dark Matter Engine class.
// ============================================================

export interface UpgradeDef {
  id: string;
  name: string;
  cost: number;
  minSize: ShipSize | null;
  /** Minimum Dark Matter Engine class required, or null. */
  minDmClass: number | null;
}

export const UPGRADES: UpgradeDef[] = [
  { id: 'afterburners', name: 'Afterburners', cost: 800, minSize: null, minDmClass: null },
  { id: 'antivirus-module', name: 'Antivirus Module', cost: 750, minSize: null, minDmClass: null },
  { id: 'arcana-resistant-coating', name: 'Arcana-Resistant Coating', cost: 2000, minSize: null, minDmClass: null },
  { id: 'cruising-engines', name: 'Cruising Engines', cost: 600, minSize: null, minDmClass: null },
  { id: 'dead-reckoner', name: 'Dead Reckoner', cost: 850, minSize: null, minDmClass: 1 },
  { id: 'expanded-shielding', name: 'Expanded Shielding', cost: 3500, minSize: null, minDmClass: null },
  { id: 'explosion-failsafe', name: 'Explosion Failsafe', cost: 700, minSize: null, minDmClass: null },
  { id: 'expanded-hold', name: 'Expanded Hold', cost: 500, minSize: 'Personal', minDmClass: null },
  { id: 'expanded-quarters', name: 'Expanded Quarters', cost: 500, minSize: null, minDmClass: null },
  { id: 'fabricator', name: 'Fabricator', cost: 750, minSize: null, minDmClass: null },
  { id: 'hypercapacitor', name: 'Hypercapacitor', cost: 3000, minSize: null, minDmClass: 1 },
  { id: 'medbay', name: 'Medbay', cost: 750, minSize: 'Personal', minDmClass: null },
  { id: 'panic-drive', name: 'Panic Drive', cost: 1000, minSize: null, minDmClass: 1 },
  { id: 'simulator', name: 'Simulator', cost: 1500, minSize: 'Transport', minDmClass: null },
  { id: 'smugglers-hold', name: "Smuggler's Hold", cost: 400, minSize: null, minDmClass: null },
];

export const UPGRADES_BY_ID: Record<string, UpgradeDef> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
);

// ------------------------------------------------------------
// Dark Matter Engine upgrade costs by class (p.220).
// The base class for a ship is set by level; upgrading the
// engine to a higher class costs the listed amount.
// ------------------------------------------------------------
export const DM_ENGINE_COSTS: Record<number, number> = {
  1: 1000,
  2: 4000,
  3: 5000,
  4: 52000,
  5: 65000,
  6: 120000,
  7: 150000,
  8: 500000,
  9: 1000000,
};

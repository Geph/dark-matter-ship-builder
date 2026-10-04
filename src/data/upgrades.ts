import type { ShipSize } from '../lib/types';

// ============================================================
// Ship Upgrades (Dark Matter Sci-Fi 5E, pp.213–214)
// Upgrades cost Credits but DO NOT consume slots.
// Some require a minimum size or a Dark Matter Engine class.
// ============================================================

export interface UpgradeDef {
  id: string;
  name: string;
  cost: number;
  description: string;
  minSize: ShipSize | null;
  /** Minimum Dark Matter Engine class required, or null. */
  minDmClass: number | null;
  maxInstalls?: number;
}

export const UPGRADES: UpgradeDef[] = [
  { id: 'afterburners', name: 'Afterburners', cost: 800, description: 'Move and Fire can add 1,000 feet of Speed for the turn if the Pilot forgoes rotating after movement (p. 213).', minSize: null, minDmClass: null },
  { id: 'antivirus-module', name: 'Antivirus Module', cost: 750, description: 'Prevents magical system disabling and N-Virus infection; hackers have Disadvantage on Intelligence (Data) checks (p. 213).', minSize: null, minDmClass: null },
  { id: 'arcana-resistant-coating', name: 'Arcana-Resistant Coating', cost: 2000, description: 'The Pilot has Advantage on saving throws against Mega spells (p. 214).', minSize: null, minDmClass: null },
  { id: 'cruising-engines', name: 'Cruising Engines', cost: 600, description: 'Doubles sublight cruising speed, not tactical Speed (pp. 214, 234).', minSize: null, minDmClass: null },
  { id: 'dead-reckoner', name: 'Dead Reckoner', cost: 850, description: 'Before a Blind Jump roll, roll 1d6; on 5–6 use Assisted Jump instead (p. 214).', minSize: null, minDmClass: 1 },
  { id: 'expanded-shielding', name: 'Expanded Shielding', cost: 3500, description: 'Shields cover two adjacent sides rather than one. Shield Points do not increase (p. 214).', minSize: null, minDmClass: null },
  { id: 'explosion-failsafe', name: 'Explosion Failsafe', cost: 700, description: 'Grants Advantage on Explosion Saving Throws (p. 214).', minSize: null, minDmClass: null },
  { id: 'expanded-hold', name: 'Expanded Hold', cost: 500, description: 'Doubles cargo capacity (p. 214).', minSize: 'Personal', minDmClass: null },
  { id: 'expanded-quarters', name: 'Expanded Quarters', cost: 500, description: 'Doubles passenger capacity beyond crew stations (p. 214).', minSize: null, minDmClass: null },
  { id: 'fabricator', name: 'Fabricator', cost: 750, description: 'Produces enough food and water for all crew and passengers (p. 214).', minSize: null, minDmClass: null },
  { id: 'hypercapacitor', maxInstalls: 2, name: 'Hypercapacitor', cost: 3000, description: 'Recharges the Dark Matter engine once before dawn instead of a spell slot; the four-jumps-per-day limit still applies. Install up to two (pp. 214, 233).', minSize: null, minDmClass: 1 },
  { id: 'medbay', name: 'Medbay', cost: 750, description: 'A Short Rest here can end Poisoned; Medicine checks have Advantage. A one-minute scan identifies injuries, poisons, diseases, parasites, and magical afflictions (p. 214).', minSize: 'Personal', minDmClass: null },
  { id: 'panic-drive', name: 'Panic Drive', cost: 1000, description: 'While charging a jump, roll 1d6 at the start of each round; on 5–6 the ship jumps early (p. 214).', minSize: null, minDmClass: 1 },
  { id: 'simulator', name: 'Simulator', cost: 1500, description: 'Creates training or recreation environments using Hallucinatory Terrain and Major Image (p. 214).', minSize: 'Transport', minDmClass: null },
  { id: 'smugglers-hold', name: "Smuggler's Hold", cost: 400, description: 'Conceals up to 1,000 lb. outside cargo capacity; each object must fit within 6 feet in every dimension (p. 214).', minSize: null, minDmClass: null },
];

export const UPGRADES_BY_ID: Record<string, UpgradeDef> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
);

// ------------------------------------------------------------
// Dark Matter Engine upgrade costs by class (p.219).
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

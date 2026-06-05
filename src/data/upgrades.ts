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
  description: string;
  minSize: ShipSize | null;
  /** Minimum Dark Matter Engine class required, or null. */
  minDmClass: number | null;
}

export const UPGRADES: UpgradeDef[] = [
  { id: 'afterburners', name: 'Afterburners', cost: 800, description: 'Boosts short-burst speed for evasive maneuvers.', minSize: null, minDmClass: null },
  { id: 'antivirus-module', name: 'Antivirus Module', cost: 750, description: 'Protects ship systems from digital intrusion and malware.', minSize: null, minDmClass: null },
  { id: 'arcana-resistant-coating', name: 'Arcana-Resistant Coating', cost: 2000, description: 'Hull coating that resists arcane damage and spell effects.', minSize: null, minDmClass: null },
  { id: 'cruising-engines', name: 'Cruising Engines', cost: 600, description: 'Improved fuel efficiency for long-range travel.', minSize: null, minDmClass: null },
  { id: 'dead-reckoner', name: 'Dead Reckoner', cost: 850, description: 'Navigation computer for jumping without a plotted course.', minSize: null, minDmClass: 1 },
  { id: 'expanded-shielding', name: 'Expanded Shielding', cost: 3500, description: 'Doubles the shield points provided by the Shield Generator.', minSize: null, minDmClass: null },
  { id: 'explosion-failsafe', name: 'Explosion Failsafe', cost: 700, description: 'Prevents catastrophic detonation when the hull is breached.', minSize: null, minDmClass: null },
  { id: 'expanded-hold', name: 'Expanded Hold', cost: 500, description: 'Additional cargo capacity for freight operations.', minSize: 'Personal', minDmClass: null },
  { id: 'expanded-quarters', name: 'Expanded Quarters', cost: 500, description: 'Extra living space for passengers and crew comfort.', minSize: null, minDmClass: null },
  { id: 'fabricator', name: 'Fabricator', cost: 750, description: 'Onboard manufacturing unit for parts and consumables.', minSize: null, minDmClass: null },
  { id: 'hypercapacitor', name: 'Hypercapacitor', cost: 3000, description: 'Power storage for rapid shield recharge and system bursts.', minSize: null, minDmClass: 1 },
  { id: 'medbay', name: 'Medbay', cost: 750, description: 'Medical bay for treating injuries during and after combat.', minSize: 'Personal', minDmClass: null },
  { id: 'panic-drive', name: 'Panic Drive', cost: 1000, description: 'Emergency jump drive for rapid escape from danger.', minSize: null, minDmClass: 1 },
  { id: 'simulator', name: 'Simulator', cost: 1500, description: 'Crew training holodeck for combat and flight drills.', minSize: 'Transport', minDmClass: null },
  { id: 'smugglers-hold', name: "Smuggler's Hold", cost: 400, description: 'Hidden compartment shielded from standard scans.', minSize: null, minDmClass: null },
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

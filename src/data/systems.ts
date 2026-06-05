import type { ShipSize } from '../lib/types';

// ============================================================
// Ship Systems (Dark Matter Sci-Fi 5E, pp.218-219)
// Each system costs 1 slot. Prerequisites and repeat rules
// are encoded so the builder can enforce them automatically.
// ============================================================

export interface SystemDef {
  id: string;
  name: string;
  cost: number; // Credits
  /** Minimum ship size required, or null for no size requirement. */
  minSize: ShipSize | null;
  /** Hard cap of installs, or null for unlimited. */
  maxInstalls: number | null;
  /**
   * If repeatable scales by ship size, this maps size -> max installs.
   * Overrides maxInstalls when present.
   */
  maxBySize?: Partial<Record<ShipSize, number>>;
  note?: string;
}

export const SYSTEMS: SystemDef[] = [
  { id: 'ai-core', name: 'AI Core', cost: 800, minSize: 'Personal', maxInstalls: 1 },
  { id: 'arcane-cannon', name: 'Arcane Cannon', cost: 700, minSize: 'Transport', maxInstalls: 1 },
  { id: 'captains-chair', name: "Captain's Chair", cost: 750, minSize: 'Transport', maxInstalls: 1 },
  { id: 'cloaking', name: 'Cloaking', cost: 3000, minSize: 'Personal', maxInstalls: 1 },
  { id: 'engineers-station', name: "Engineer's Station", cost: 800, minSize: 'Personal', maxInstalls: 1 },
  { id: 'escape-pods', name: 'Escape Pods', cost: 600, minSize: null, maxInstalls: 1 },
  { id: 'escape-pod-fighter', name: 'Escape Pod (Fighter)', cost: 50, minSize: null, maxInstalls: null },
  {
    id: 'fighter-bay',
    name: 'Fighter Bay',
    cost: 850,
    minSize: 'Transport',
    maxInstalls: null,
    // Repeatable by size: Transport (2), Corvette (3), Frigate (3), Cruiser (4), Capital (4)
    maxBySize: { Transport: 2, Corvette: 3, Frigate: 3, Cruiser: 4, Capital: 4 },
    note: 'Repeatable; max copies scale with ship size.',
  },
  {
    id: 'gunner-bay',
    name: 'Gunner Bay',
    cost: 500,
    minSize: 'Personal',
    maxInstalls: null,
    note: 'Repeatable, no limit.',
  },
  { id: 'life-support', name: 'Life Support', cost: 400, minSize: null, maxInstalls: 1 },
  { id: 'manipulators', name: 'Manipulators', cost: 550, minSize: 'Personal', maxInstalls: 1 },
  {
    id: 'pilots-seat',
    name: "Pilot's Seat",
    cost: 400,
    minSize: null,
    maxInstalls: null,
    // Max 2 on Personal size or larger; 1 on Fighter.
    maxBySize: { Fighter: 1, Personal: 2, Transport: 2, Corvette: 2, Frigate: 2, Cruiser: 2, Capital: 2 },
    note: 'Repeatable; max 2 on Personal size or larger.',
  },
  { id: 'probe', name: 'Probe', cost: 450, minSize: 'Personal', maxInstalls: 1 },
  { id: 'sensors', name: 'Sensors', cost: 400, minSize: null, maxInstalls: 1 },
  { id: 'shield-generator', name: 'Shield Generator', cost: 500, minSize: null, maxInstalls: 1 },
  { id: 'signal-jammer', name: 'Signal Jammer', cost: 2500, minSize: 'Personal', maxInstalls: 1 },
  {
    id: 'teleporters',
    name: 'Teleporters',
    cost: 2000,
    minSize: 'Transport',
    maxInstalls: 1,
    // Repeatable (2x) on Frigate or larger.
    maxBySize: { Transport: 1, Corvette: 1, Frigate: 2, Cruiser: 2, Capital: 2 },
    note: 'Repeatable (2x) on Frigate or larger.',
  },
  { id: 'tractor-beam', name: 'Tractor Beam', cost: 1000, minSize: 'Personal', maxInstalls: 1 },
];

export const SYSTEMS_BY_ID: Record<string, SystemDef> = Object.fromEntries(
  SYSTEMS.map((s) => [s.id, s]),
);

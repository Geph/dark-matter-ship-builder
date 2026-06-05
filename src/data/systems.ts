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
  description: string;
  /** Minimum ship size required, or null for no size requirement. */
  minSize: ShipSize | null;
  /** Hard cap of installs, or null for unlimited. */
  maxInstalls: number | null;
  /**
   * If repeatable scales by ship size, this maps size -> max installs.
   * Overrides maxInstalls when present.
   */
  maxBySize?: Partial<Record<ShipSize, number>>;
  /** Pre-installed in the hull; not a weapon mount point. */
  hullEmbedded?: boolean;
  note?: string;
}

export const SYSTEMS: SystemDef[] = [
  {
    id: 'ai-core',
    name: 'AI Core',
    cost: 800,
    description: 'Shipboard AI assists navigation, diagnostics, and automated routines.',
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'arcane-cannon',
    name: 'Arcane Cannon',
    cost: 700,
    description: 'Built-in arcane artillery enabling Mega Spell attacks from the ship.',
    minSize: 'Transport',
    maxInstalls: 1,
  },
  {
    id: 'captains-chair',
    name: "Captain's Chair",
    cost: 750,
    description: 'Command station with tactical displays for coordinating the crew.',
    minSize: 'Transport',
    maxInstalls: 1,
  },
  {
    id: 'cloaking',
    name: 'Cloaking',
    cost: 3000,
    description: 'Stealth field that masks the ship from sensors and visual detection.',
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'engineers-station',
    name: "Engineer's Station",
    cost: 800,
    description: 'Maintenance console for repairs, power routing, and system overrides.',
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'escape-pods',
    name: 'Escape Pods',
    cost: 600,
    description:
      'Emergency evacuation capsules integrated into the hull structure. Not compatible with custom fighter builds.',
    minSize: null,
    maxInstalls: 1,
    hullEmbedded: true,
  },
  {
    id: 'escape-pod-fighter',
    name: 'Escape Pod (Fighter)',
    cost: 50,
    description: 'Single-seat fighter escape pod — only compatible with Fighter-class hulls.',
    minSize: null,
    maxInstalls: null,
    maxBySize: { Fighter: Infinity },
    note: 'Fighter-class hulls only. Replaces standard Escape Pods on custom fighter builds.',
  },
  {
    id: 'fighter-bay',
    name: 'Fighter Bay',
    cost: 850,
    description: 'Hangar bay for deploying and recovering a fighter craft.',
    minSize: 'Transport',
    maxInstalls: null,
    maxBySize: { Transport: 2, Corvette: 3, Frigate: 3, Cruiser: 4, Capital: 4 },
    note: 'Repeatable; max copies scale with ship size.',
  },
  {
    id: 'gunner-bay',
    name: 'Gunner Bay',
    cost: 500,
    description: 'Weapon control station for targeting and firing ship armaments.',
    minSize: 'Personal',
    maxInstalls: null,
    note: 'Repeatable, no limit.',
  },
  {
    id: 'life-support',
    name: 'Life Support',
    cost: 400,
    description: 'Atmosphere, temperature, and gravity regulation for the crew.',
    minSize: null,
    maxInstalls: 1,
    hullEmbedded: true,
  },
  {
    id: 'manipulators',
    name: 'Manipulators',
    cost: 550,
    description: 'External robotic arms for cargo handling and salvage operations.',
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'pilots-seat',
    name: "Pilot's Seat",
    cost: 400,
    description: 'Helm controls for piloting the vessel through space.',
    minSize: null,
    maxInstalls: null,
    maxBySize: { Fighter: 1, Personal: 2, Transport: 2, Corvette: 2, Frigate: 2, Cruiser: 2, Capital: 2 },
    hullEmbedded: true,
    note: 'Repeatable; max 2 on Personal size or larger.',
  },
  {
    id: 'probe',
    name: 'Probe',
    cost: 450,
    description: 'Deployable sensor probe for scouting and long-range reconnaissance.',
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'sensors',
    name: 'Sensors',
    cost: 400,
    description: 'Primary sensor array for navigation, scanning, and threat detection.',
    minSize: null,
    maxInstalls: 1,
    hullEmbedded: true,
  },
  {
    id: 'shield-generator',
    name: 'Shield Generator',
    cost: 500,
    description: 'Energy shield projector; shield points scale with ship size.',
    minSize: null,
    maxInstalls: 1,
    hullEmbedded: true,
  },
  {
    id: 'signal-jammer',
    name: 'Signal Jammer',
    cost: 2500,
    description: 'Disrupts enemy communications and targeting systems.',
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'teleporters',
    name: 'Teleporters',
    cost: 2000,
    description: 'Matter transmission pads for boarding actions and rapid deployment.',
    minSize: 'Transport',
    maxInstalls: 1,
    maxBySize: { Transport: 1, Corvette: 1, Frigate: 2, Cruiser: 2, Capital: 2 },
    note: 'Repeatable (2x) on Frigate or larger.',
  },
  {
    id: 'tractor-beam',
    name: 'Tractor Beam',
    cost: 1000,
    description: 'Graviton projector for capturing, towing, or restraining objects.',
    minSize: 'Personal',
    maxInstalls: 1,
  },
];

export const SYSTEMS_BY_ID: Record<string, SystemDef> = Object.fromEntries(
  SYSTEMS.map((s) => [s.id, s]),
);

/** Systems integrated into the hull body — not weapon mount points. */
export const HULL_EMBEDDED_SYSTEM_IDS = SYSTEMS.filter((s) => s.hullEmbedded).map(
  (s) => s.id,
);

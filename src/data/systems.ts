import type { ShipSize } from '../lib/types';

// ============================================================
// Ship Systems (Dark Matter Sci-Fi 5E, pp. 206–209)
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
    description: "AI: Int 17, Wis 13, Cha 14; Data and Technology proficiency (+2 PB); +3 to Strength, Dexterity and Constitution D20 Tests. Can Study or fill an available Crew Role, acting last in Initiative (p. 207).",
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'arcane-cannon',
    name: 'Arcane Cannon',
    cost: 700,
    description: "Allows the Gunner to cast Mega spells or magnify eligible spells using the Arcane Cannon action (pp. 207, 220).",
    minSize: 'Transport',
    maxInstalls: 1,
  },
  {
    id: 'captains-chair',
    name: "Captain's Chair",
    cost: 750,
    description: "Grants the Captain Crew Role (p. 207).",
    minSize: 'Transport',
    maxInstalls: 1,
  },
  {
    id: 'cloaking',
    name: 'Cloaking',
    cost: 3000,
    description: "Use System: spend 1 of 6 charges to become Invisible for 1 minute. Ends after attacking, dealing damage, or moving over 1,000 feet on a turn. Regains 1d6 charges at dawn (p. 207).",
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'engineers-station',
    name: "Engineer's Station",
    cost: 800,
    description: "Grants the Engineer Crew Role (p. 207).",
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'escape-pods',
    name: 'Escape Pods',
    cost: 600,
    description:
      "Utilize action: board a pod and eject. Provides evacuation for crew and passengers, 7 days of supplies, and a distress signal. Fighters use the 50 CR single-pod option (pp. 207–208).",
    minSize: null,
    maxInstalls: 1,
    hullEmbedded: true,
  },
  {
    id: 'escape-pod-fighter',
    name: 'Escape Pod (Fighter)',
    cost: 50,
    description: "The Pilot automatically ejects at 0 MHP. Provides 7 days of supplies and a distress signal (pp. 207–208).",
    minSize: null,
    maxInstalls: 1,
    maxBySize: { Fighter: 1 },
    note: 'Fighter-class hulls only. Replaces standard Escape Pods on custom fighter builds.',
  },
  {
    id: 'fighter-bay',
    name: 'Fighter Bay',
    cost: 850,
    description: "Holds one Fighter-size ship. A creature boards and launches it as a Bonus Action, becoming its Pilot. Docking takes an action (p. 208).",
    minSize: 'Transport',
    maxInstalls: null,
    maxBySize: { Transport: 2, Corvette: 3, Frigate: 3, Cruiser: 4, Capital: 4 },
    note: 'Repeatable; max copies scale with ship size.',
  },
  {
    id: 'gunner-bay',
    name: 'Gunner Bay',
    cost: 500,
    description: "Grants a Gunner Crew Role; repeatable without a fixed cap (p. 208).",
    minSize: 'Personal',
    maxInstalls: null,
    note: 'Repeatable, no limit.',
  },
  {
    id: 'life-support',
    name: 'Life Support',
    cost: 400,
    description: "Provides atmosphere, heat and artificial gravity. If disabled, backup air and heat last 1 hour; gravity stops. Use System can disable it or vent sections of the ship (p. 208).",
    minSize: null,
    maxInstalls: 1,
    hullEmbedded: true,
  },
  {
    id: 'manipulators',
    name: 'Manipulators',
    cost: 550,
    description: "Use System: handle an object within 500 feet, retrieve cargo, clear debris or open a hatch; can push a smaller Mega target up to 1,000 feet away (p. 208).",
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'pilots-seat',
    name: "Pilot's Seat",
    cost: 400,
    description: "Grants a Pilot Crew Role. Two Pilots must take different actions each combat round (p. 208).",
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
    description: "Use System to launch, dock or control a remote drone: 5 MHP, AC 12, Speed 1,500 feet, Maneuverability 360 degrees. Relays sight, sound and environmental readings (p. 208).",
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'sensors',
    name: 'Sensors',
    cost: 400,
    description: "Perception and communications to 1,000 miles. Disabled Sensors impose Disadvantage on ship attacks. Engineer can deep scan within 1 mile or scan a planet within 1,000 miles using Intelligence (Investigation) (pp. 208–209).",
    minSize: null,
    maxInstalls: 1,
    hullEmbedded: true,
  },
  {
    id: 'shield-generator',
    name: 'Shield Generator',
    cost: 500,
    description: "Projects a forward-facing shield; Engineer can change facing as a Bonus Action. Disabled generator removes SP until repaired. Created ships use the p. 218 level table; ordinary fighters gain 4 SP (p. 209).",
    minSize: null,
    maxInstalls: 1,
    hullEmbedded: true,
  },
  {
    id: 'signal-jammer',
    name: 'Signal Jammer',
    cost: 2500,
    description: "Use System: target a ship within 3,000 feet. Wisdom save DC 8 + Engineer Intelligence modifier + PB; failure disables its Sensors until the start of the Engineer’s next turn, imposing Disadvantage on attacks (p. 209).",
    minSize: 'Personal',
    maxInstalls: 1,
  },
  {
    id: 'teleporters',
    name: 'Teleporters',
    cost: 2000,
    description: "Use System: create a destination circle at an unmoving location within 100 miles for 1 minute. Entering a ship with a working Dark Matter engine requires coordination. A second installation on Frigate+ is always active for internal transit (p. 209).",
    minSize: 'Transport',
    maxInstalls: 1,
    maxBySize: { Transport: 1, Corvette: 1, Frigate: 2, Cruiser: 2, Capital: 2 },
    note: 'Repeatable (2x) on Frigate or larger.',
  },
  {
    id: 'tractor-beam',
    name: 'Tractor Beam',
    cost: 1000,
    description: "Use System: target within 3,000 feet makes a Dexterity save, DC 8 + Engineer Strength or Intelligence modifier + PB; larger ships or creatures automatically succeed. Failure pulls it up to 1,000 feet and sets Speed to 0. Repeat save at end of each target turn; subsequent Utilize actions can pull again (p. 209).",
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

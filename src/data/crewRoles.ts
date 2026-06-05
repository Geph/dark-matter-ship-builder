// ============================================================
// Crew Roles -> auto-added Crew Systems (Dark Matter 5E, p.215)
// Choosing a role automatically installs (for free) its
// corresponding system. A Pilot may instead take a Fighter Bay
// for a deployable ship (level 5+).
// ============================================================

export interface CrewSkillField {
  key: keyof import('../lib/types').CrewMemberData;
  label: string;
  hint: string;
}

export interface CrewRole {
  id: string;
  label: string;
  description: string;
  /** System id automatically granted by this role. */
  systemId: string;
  /** Minimum character level required to choose this role. */
  minLevel?: number;
  /** Fields to collect for skill checks and combat rolls. */
  skillFields: CrewSkillField[];
}

export const CREW_ROLES: CrewRole[] = [
  {
    id: 'pilot',
    label: 'Pilot',
    description: "Flies the ship. Grants a Pilot's Seat.",
    systemId: 'pilots-seat',
    skillFields: [
      { key: 'name', label: 'Pilot Name', hint: 'Character operating the helm.' },
      { key: 'skillModifier', label: 'Vehicles (Space) Mod.', hint: 'Pilot skill checks & maneuver rolls.' },
    ],
  },
  {
    id: 'pilot-fighter',
    label: 'Pilot (Fighter Bay)',
    description:
      'Flies a deployable fighter. First Fighter Bay you install is free. Level 5+.',
    systemId: 'fighter-bay',
    minLevel: 5,
    skillFields: [
      { key: 'name', label: 'Pilot Name', hint: 'Fighter pilot callsign.' },
      { key: 'skillModifier', label: 'Vehicles (Space) Mod.', hint: 'Fighter maneuver & dogfight rolls.' },
    ],
  },
  {
    id: 'gunner',
    label: 'Gunner',
    description: 'Operates the ship weapons. Grants a Gunner Bay.',
    systemId: 'gunner-bay',
    skillFields: [
      { key: 'name', label: 'Gunner Name', hint: 'Weapon systems operator.' },
      { key: 'skillModifier', label: 'Gunnery Mod.', hint: 'Targeting and weapon system checks.' },
      { key: 'attackBonus', label: 'Attack Bonus', hint: 'Added to d20 weapon attack rolls.' },
    ],
  },
  {
    id: 'engineer',
    label: 'Engineer',
    description: "Maintains the ship. Grants an Engineer's Station.",
    systemId: 'engineers-station',
    skillFields: [
      { key: 'name', label: 'Engineer Name', hint: 'Chief technician on board.' },
      { key: 'skillModifier', label: 'Mechanics Mod.', hint: 'Repairs, jury-rigs, and system diagnostics.' },
    ],
  },
  {
    id: 'captain',
    label: 'Captain',
    description: "Commands the crew. Grants a Captain's Chair. Level 5+.",
    systemId: 'captains-chair',
    minLevel: 5,
    skillFields: [
      { key: 'name', label: 'Captain Name', hint: 'Commanding officer.' },
      { key: 'skillModifier', label: 'Leadership Mod.', hint: 'Morale, command, and crew coordination.' },
    ],
  },
];

export const CREW_ROLES_BY_ID: Record<string, CrewRole> = Object.fromEntries(
  CREW_ROLES.map((r) => [r.id, r]),
);

/**
 * The four systems every ship starts with for free, in addition
 * to crew-role systems (Dark Matter 5E, p.218).
 */
export const STARTING_SYSTEM_IDS = [
  'escape-pods',
  'life-support',
  'sensors',
  'shield-generator',
];

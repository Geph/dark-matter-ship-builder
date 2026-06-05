// ============================================================
// Crew Roles -> auto-added Crew Systems (Dark Matter 5E, p.215)
// Choosing a role automatically installs (for free) its
// corresponding system. A Pilot may instead take a Fighter Bay
// for a deployable ship (level 5+).
// ============================================================

export interface CrewRole {
  id: string;
  label: string;
  description: string;
  /** System id automatically granted by this role. */
  systemId: string;
  /** Minimum character level required to choose this role. */
  minLevel?: number;
}

export const CREW_ROLES: CrewRole[] = [
  {
    id: 'pilot',
    label: 'Pilot',
    description: "Flies the ship. Grants a Pilot's Seat.",
    systemId: 'pilots-seat',
  },
  {
    id: 'pilot-fighter',
    label: 'Pilot (Fighter Bay)',
    description: 'Flies a deployable fighter. Grants a Fighter Bay. Level 5+.',
    systemId: 'fighter-bay',
    minLevel: 5,
  },
  {
    id: 'gunner',
    label: 'Gunner',
    description: 'Operates the ship weapons. Grants a Gunner Bay.',
    systemId: 'gunner-bay',
  },
  {
    id: 'engineer',
    label: 'Engineer',
    description: "Maintains the ship. Grants an Engineer's Station.",
    systemId: 'engineers-station',
  },
  {
    id: 'captain',
    label: 'Captain',
    description: "Commands the crew. Grants a Captain's Chair. Level 5+.",
    systemId: 'captains-chair',
    minLevel: 5,
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

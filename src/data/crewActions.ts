import type { ShipSize } from '../lib/types';
import { sizeRank } from './shipStats';

// ============================================================
// Crew role actions (Dark Matter Sci-Fi 5E, pp. 220–222).
// ============================================================

export type CrewActionType =
  | 'skillCheck'
  | 'contestedCheck'
  | 'diceRoll'
  | 'attackDisadvantage'
  | 'description';

export interface CrewActionDef {
  id: string;
  roleId: string;
  name: string;
  description: string;
  type: CrewActionType;
  /** Skill label shown on roll buttons, e.g. "Dex (Piloting)". */
  skillLabel?: string;
  /** Fixed DC when the rulebook specifies one. */
  dc?: number;
  /** Dice notation for simple rolls (e.g. Brace for Impact 1d6). */
  dice?: string;
  /** Minimum ship size (inclusive). */
  minSize?: ShipSize;
  /** Maximum ship size (inclusive). */
  maxSize?: ShipSize;
  /** Required installed system id. */
  requiresSystem?: string;
  source: string;
}

export const CREW_ACTIONS: CrewActionDef[] = [
  // —— Captain (pp. 220–221) ——
  {
    id: 'captain-initiative',
    roleId: 'captain',
    name: 'Roll Ship Initiative',
    description:
      'When you take the Captain role at initiative, roll once for the entire crew. The party acts on that turn while you remain captain.',
    type: 'description',
    source: 'Captain',
  },
  {
    id: 'captain-boarding',
    roleId: 'captain',
    name: 'Boarding Party',
    description:
      'When boarding conditions are met, use your action to form a boarding party (you may join) and deploy the umbilicus.',
    type: 'description',
    source: 'Captain',
  },
  {
    id: 'captain-brace',
    roleId: 'captain',
    name: 'Brace for Impact',
    description:
      'Use your action to brace the ship. Before your next turn, each time the ship takes damage you may roll 1d6 and subtract it from mega damage taken (minimum 1).',
    type: 'diceRoll',
    dice: '1d6',
    source: 'Captain',
  },
  {
    id: 'captain-deep-scan',
    roleId: 'captain',
    name: 'Deep Scan',
    description:
      'With sensors installed, use your action to deep-scan an object within sensor range and make an Intelligence (Investigation) check to examine it.',
    type: 'skillCheck',
    skillLabel: 'Int (Investigation)',
    requiresSystem: 'sensors',
    source: 'Captain',
  },
  {
    id: 'captain-fire-at-will',
    roleId: 'captain',
    name: 'Fire at Will',
    description:
      'Use your action to declare a barrage. One gunner you choose can use its reaction to make one attack with a ship weapon.',
    type: 'description',
    source: 'Captain',
  },
  {
    id: 'captain-full-speed',
    roleId: 'captain',
    name: 'Full Speed Ahead',
    description:
      'Use your action to push the engines. The pilot can use its reaction to move the ship half its movement within the cone of movement.',
    type: 'description',
    source: 'Captain',
  },

  // —— Pilot (pp. 221–222) ——
  {
    id: 'pilot-move',
    roleId: 'pilot',
    name: 'Move',
    description:
      'Use your action to move the ship up to its speed within the cone of movement, then rotate facing by up to the ship\'s maneuverability.',
    type: 'description',
    source: 'Pilot',
  },
  {
    id: 'pilot-evasive',
    roleId: 'pilot',
    name: 'Evasive Maneuvers',
    description:
      'Corvette-sized or smaller only. Use your action instead of moving normally. Until your next turn, add your Dexterity modifier to the ship\'s AC and gain advantage on Dexterity saves made for the ship.',
    type: 'description',
    maxSize: 'Corvette',
    source: 'Pilot',
  },
  {
    id: 'pilot-dogfighting',
    roleId: 'pilot',
    name: 'Dogfighting',
    description:
      'Corvette-sized or smaller only. If a same-size ship is behind you within 1,000 ft, use your action to make a contested Dexterity (Piloting) check. On a success, you switch places; facing stays the same.',
    type: 'contestedCheck',
    skillLabel: 'Dex (Piloting)',
    maxSize: 'Corvette',
    source: 'Pilot',
  },
  {
    id: 'pilot-hard-turn',
    roleId: 'pilot',
    name: 'Hard Turn',
    description:
      'Corvette-sized or smaller only. Use your action to move 500 feet in any direction and rotate to face any direction.',
    type: 'description',
    maxSize: 'Corvette',
    source: 'Pilot',
  },
  {
    id: 'pilot-match-speed',
    roleId: 'pilot',
    name: 'Match Speed',
    description:
      'Use your action to match another visible ship\'s rate and heading until your next turn, maintaining distance and angle. Ends if the target outruns you or uses Hard Turn.',
    type: 'description',
    source: 'Pilot',
  },
  {
    id: 'pilot-ram',
    roleId: 'pilot',
    name: 'Ram',
    description:
      'Frigate-sized or smaller. Move up to speed into an enemy ship or mega creature\'s space. Both take mega bludgeoning damage: 2d10 (Fighter/Personal), 3d10 (Transport), 4d10 (Corvette/Frigate).',
    type: 'diceRoll',
    dice: '2d10',
    maxSize: 'Frigate',
    source: 'Pilot',
  },

  // —— Gunner (pp. 221) ——
  {
    id: 'gunner-open-fire',
    roleId: 'gunner',
    name: 'Open Fire',
    description:
      'Take the Attack action to fire one ship weapon. Extra Attack and similar features grant additional attacks with that weapon.',
    type: 'description',
    source: 'Gunner',
  },
  {
    id: 'gunner-readied',
    roleId: 'gunner',
    name: 'Readied Attacks',
    description:
      'Use your action to ready a ship weapon attack, such as intercepting torpedoes the moment they launch.',
    type: 'description',
    source: 'Gunner',
  },
  {
    id: 'gunner-switch-weapon',
    roleId: 'gunner',
    name: 'Switch Weapons',
    description:
      'Use a bonus action on your turn to switch which ship weapon you are operating. You may only fire one weapon at a time.',
    type: 'description',
    source: 'Gunner',
  },

  // —— Engineer (pp. 221–222) ——
  {
    id: 'engineer-switch-shield',
    roleId: 'engineer',
    name: 'Switch Shield Facing',
    description:
      'Use a bonus action to rotate the directional shield to another side of the ship. Shields cover one side by default.',
    type: 'description',
    requiresSystem: 'shield-generator',
    source: 'Engineer',
  },
  {
    id: 'engineer-direct-power',
    roleId: 'engineer',
    name: 'Directing Power',
    description:
      'Use your action to deactivate shields and route power to engines (+half speed until next turn) or a weapon (gunners gain one extra attack with that weapon on Open Fire). Or draw power from weapons to strengthen shields (two consecutive sides covered, full shield recharge, but gunners lose one attack).',
    type: 'description',
    requiresSystem: 'shield-generator',
    source: 'Engineer',
  },
  {
    id: 'engineer-overcharge',
    roleId: 'engineer',
    name: 'Overcharge Engine',
    description:
      'Spellcaster only. Expend a spell slot ≥ the Dark Matter engine class to overcharge: shields fully recharge, speed increases by half, and each gunner gains one extra weapon attack until your next turn. Once per minute.',
    type: 'description',
    source: 'Engineer',
  },
  {
    id: 'engineer-repair',
    roleId: 'engineer',
    name: 'System Repair',
    description:
      'Use your action to repair a deactivated system or weapon at 0 MHP. DC 15 Intelligence (Technology) check; on success it regains 1 MHP and reactivates at the start of your next turn.',
    type: 'skillCheck',
    skillLabel: 'Int (Technology)',
    dc: 15,
    source: 'Engineer',
  },
  {
    id: 'engineer-void-jump',
    roleId: 'engineer',
    name: 'Void Jump',
    description:
      'Begin charging a void jump. After 1 minute the ship jumps; the pilot rolls on the Jump Navigation table when the jump begins.',
    type: 'description',
    source: 'Engineer',
  },

  // —— Pilot (Fighter Bay) / Dogfighter (pp. 220–221) ——
  {
    id: 'dogfighter-launch',
    roleId: 'pilot-fighter',
    name: 'Launch / Dock Fighter',
    description:
      'Use your action to launch your fighter from the bay or dock while adjacent to the mothership. You may only switch roles while docked.',
    type: 'description',
    requiresSystem: 'fighter-bay',
    source: 'Dogfighter',
  },
  {
    id: 'dogfighter-move-fire',
    roleId: 'pilot-fighter',
    name: 'Fighter Movement & Fire',
    description:
      'While deployed, move your fighter its full speed without spending an action and use your action to fire its weapons (as Gunner Open Fire / Pilot Move rules).',
    type: 'description',
    source: 'Dogfighter',
  },
  {
    id: 'dogfighter-targeted',
    roleId: 'pilot-fighter',
    name: 'Targeted Attack',
    description:
      'Within 1,000 ft of another ship, use your action to attack with disadvantage to disable a system, weapon, or impulse engines (10 MHP each). Shielded hits deduct from shield points first.',
    type: 'attackDisadvantage',
    skillLabel: 'Attack',
    source: 'Dogfighter',
  },
  {
    id: 'dogfighter-eject',
    roleId: 'pilot-fighter',
    name: 'Eject',
    description:
      'If your fighter is destroyed, use your reaction to eject in a life pod.',
    type: 'description',
    source: 'Dogfighter',
  },
];

export const CREW_ACTIONS_BY_ROLE: Record<string, CrewActionDef[]> = CREW_ROLES_GROUP();

function CREW_ROLES_GROUP(): Record<string, CrewActionDef[]> {
  const out: Record<string, CrewActionDef[]> = {};
  for (const action of CREW_ACTIONS) {
    (out[action.roleId] ??= []).push(action);
  }
  return out;
}

/** Whether this action is available on the given ship. */
export function isActionAvailable(
  action: CrewActionDef,
  ship: { size: ShipSize; systems: Record<string, number> },
): { ok: boolean; reason?: string } {
  if (action.requiresSystem && (ship.systems[action.requiresSystem] ?? 0) < 1) {
    const name = action.requiresSystem.replace(/-/g, ' ');
    return { ok: false, reason: `Requires ${name} system.` };
  }
  if (action.minSize && sizeRank(ship.size) < sizeRank(action.minSize)) {
    return { ok: false, reason: `Requires ${action.minSize} size or larger.` };
  }
  if (action.maxSize && sizeRank(ship.size) > sizeRank(action.maxSize)) {
    return { ok: false, reason: `Only on ${action.maxSize} size or smaller.` };
  }
  return { ok: true };
}

/** Ram damage dice by ship size (p. 222). */
export function ramDamageDice(size: ShipSize): string {
  if (size === 'Transport') return '3d10';
  if (size === 'Corvette' || size === 'Frigate') return '4d10';
  return '2d10';
}

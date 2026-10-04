import type { ShipSize } from '../lib/types';
import { sizeRank } from './shipStats';

/** Player actions from the March 2026 book, printed pp. 208–224. */
export type CrewActionType = 'skillCheck' | 'contestedCheck' | 'diceRoll' | 'attackDisadvantage' | 'description';
export interface CrewActionDef {
  id: string; roleId: string; name: string; description: string; type: CrewActionType;
  skillLabel?: string; dc?: number; dice?: string;
  minSize?: ShipSize; maxSize?: ShipSize; requiresSystem?: string; requiresEngine?: boolean;
  source: string;
}

const PILOT_ACTIONS: CrewActionDef[] = [
  { id: 'pilot-move-fire', roleId: 'pilot', name: 'Move and Fire', type: 'description', source: 'p. 221',
    description: 'Action: move up to Speed within the movement cone and take the Attack action, then rotate by up to Maneuverability. On Personal or larger ships, make only one attack, using a Melee or Fixed weapon. Fighters can use their normal Attack action, including applicable Extra Attack.' },
  { id: 'pilot-evasive', roleId: 'pilot', name: 'Evasive Maneuvers', type: 'skillCheck', skillLabel: 'Dexterity (Piloting)', dc: 15, source: 'p. 221',
    description: 'Action: move 500 feet in any direction and face any direction. On a DC 15 Dexterity (Piloting) success, attacks against the ship have Disadvantage and its Pilot has Advantage on Dexterity saves for the ship until the next turn. No size restriction.' },
  { id: 'pilot-targeted', roleId: 'pilot', name: 'Targeted Strike', type: 'description', maxSize: 'Fighter', source: 'p. 221',
    description: 'Fighter only. Action: move up to half Speed within the movement cone and make one weapon attack. If it hits and deals damage through the shields, disable one system of your choice. This action does not itself impose Disadvantage.' },
  { id: 'pilot-void-jump', roleId: 'pilot', name: 'Void Jump', type: 'description', requiresEngine: true, source: 'pp. 221, 233',
    description: 'Action: begin a one-minute jump charge that cannot be stopped. The Pilot chooses the destination and navigation method. Engines normally allow two jumps per day, plus at most two recharges using appropriate spell slots or Hypercapacitors.' },
  { id: 'pilot-boarding', roleId: 'pilot', name: 'Board Another Ship', type: 'description', source: 'p. 223',
    description: 'Utilize action: when within 500 feet, connect the docking mechanism to let a party board the other ship.' },
];

export const CREW_ACTIONS: CrewActionDef[] = [
  { id: 'captain-initiative', roleId: 'captain', name: 'Ship Initiative', type: 'description', source: 'p. 222',
    description: 'At combat start, the Captain rolls ship Initiative. On its turn, the Captain chooses the turn order of crew members, including deployed fighter crew. Characters without a Crew Role roll separately.' },
  { id: 'captain-fire-at-will', roleId: 'captain', name: 'Fire at Will', type: 'description', source: 'p. 220',
    description: 'Action: direct one Gunner to spend a Reaction making one ship-weapon attack.' },
  { id: 'captain-full-power-shields', roleId: 'captain', name: 'Full Power to Shields', type: 'description', requiresSystem: 'shield-generator', source: 'p. 220',
    description: 'Action: restore all of the ship’s Shield Points.' },
  { id: 'captain-full-speed', roleId: 'captain', name: 'Full Speed Ahead', type: 'description', source: 'p. 220',
    description: 'Action: direct one Pilot to spend a Reaction moving the ship up to half Speed within its movement cone.' },
  { id: 'engineer-switch-shield', roleId: 'engineer', name: 'Move Shield', type: 'description', requiresSystem: 'shield-generator', source: 'pp. 214, 220',
    description: 'Bonus Action: change the shield facing. It covers one side, or two adjacent sides with Expanded Shielding.' },
  { id: 'engineer-emergency-repairs', roleId: 'engineer', name: 'Emergency Repairs', type: 'skillCheck', skillLabel: 'Strength (Athletics) or Intelligence (Technology)', dc: 15, source: 'p. 220',
    description: 'Action: DC 15 Strength (Athletics) or Intelligence (Technology). On success, restore a number of d6 Mega Hit Points equal to half your character level, rounded down (minimum 1d6), plus the Strength or Intelligence ability modifier used for the check. Do not add proficiency to healing.' },
  { id: 'engineer-use-system', roleId: 'engineer', name: 'Use System', type: 'description', source: 'p. 220',
    description: 'Action: activate an installed system whose description calls for Use System. Apply that system’s ranges, checks, saves, and charges.' },
  { id: 'engineer-repair', roleId: 'engineer', name: 'Repair Disabled System', type: 'skillCheck', skillLabel: 'Intelligence (Technology)', dc: 15, source: 'p. 224',
    description: 'Any character can take a Utilize action to try a DC 15 Intelligence (Technology) check. Success immediately re-enables one disabled system; no separate system HP or next-turn delay.' },
  { id: 'engineer-deep-scan', roleId: 'engineer', name: 'Deep Scan', type: 'skillCheck', skillLabel: 'Intelligence (Investigation)', requiresSystem: 'sensors', source: 'p. 208',
    description: 'Use System: scan an object within 1 mile with Intelligence (Investigation). The GM sets the check and information revealed, including lifesigns and functional power.' },
  { id: 'engineer-planetary-scan', roleId: 'engineer', name: 'Planetary Scan', type: 'skillCheck', skillLabel: 'Intelligence (Investigation)', requiresSystem: 'sensors', source: 'p. 209',
    description: 'Use System: scan a planet within 1,000 miles with Intelligence (Investigation) for major environmental hazards, habitation, and GM-chosen details.' },
  { id: 'gunner-attack', roleId: 'gunner', name: 'Attack', type: 'description', source: 'pp. 210–213, 220–221',
    description: 'Take the Attack action using any installed ship weapons. Apply your character’s weapon proficiencies and applicable class features. Recharge weapons can fire only once before the start of the Initiative order. Mastery effects apply only if the character has unlocked that weapon’s mastery.' },
  { id: 'gunner-arcane-cannon', roleId: 'gunner', name: 'Arcane Cannon', type: 'description', requiresSystem: 'arcane-cannon', source: 'p. 220',
    description: 'Magic action: cast a Mega spell or magnify an eligible action/Bonus Action spell targeting an area or another creature, with GM approval. Multiply distances by 100; use Mega damage and targets. Atmosphere or significant gravity disrupts the spell. Concentration saves after ship damage use DC max(10, half Mega damage rounded down), capped at 30.' },
  ...PILOT_ACTIONS,
  { id: 'dogfighter-launch', roleId: 'pilot-fighter', name: 'Launch / Dock Fighter', type: 'description', requiresSystem: 'fighter-bay', source: 'pp. 208, 223',
    description: 'Bonus Action: board and launch from a Fighter Bay, becoming that craft’s Pilot. Docking takes an action. Use the deployed fighter’s stats and Pilot actions below.' },
  ...PILOT_ACTIONS.map((action) => ({ ...action, id: action.id.replace('pilot-', 'dogfighter-'), roleId: 'pilot-fighter' })),
  { id: 'dogfighter-eject', roleId: 'pilot-fighter', name: 'Escape Pod', type: 'description', source: 'pp. 207–208',
    description: 'If the fighter has an Escape Pod, its Pilot ejects automatically at 0 Mega Hit Points. No Reaction is required.' },
];

export const CREW_ACTIONS_BY_ROLE: Record<string, CrewActionDef[]> = {};
for (const action of CREW_ACTIONS) (CREW_ACTIONS_BY_ROLE[action.roleId] ??= []).push(action);

export function isActionAvailable(
  action: CrewActionDef,
  ship: { size: ShipSize; systems: Record<string, number>; darkMatterClass?: number },
): { ok: boolean; reason?: string } {
  // Flight actions of a fighter pilot refer to the deployed craft, not its carrier.
  if (action.roleId === 'pilot-fighter' && !action.requiresSystem) {
    if (action.requiresEngine) return { ok: false, reason: 'Catalog fighters have no Dark Matter engine.' };
    return { ok: true };
  }
  if (action.requiresEngine && !(ship.darkMatterClass && ship.darkMatterClass > 0)) return { ok: false, reason: 'Requires a Dark Matter engine.' };
  if (action.requiresSystem && !(ship.systems[action.requiresSystem] > 0)) return { ok: false, reason: 'Requires ' + action.requiresSystem.replace(/-/g, ' ') + ' system.' };
  if (action.minSize && sizeRank(ship.size) < sizeRank(action.minSize)) return { ok: false, reason: 'Requires ' + action.minSize + ' size or larger.' };
  if (action.maxSize && sizeRank(ship.size) > sizeRank(action.maxSize)) return { ok: false, reason: 'Only on ' + action.maxSize + ' size or smaller.' };
  return { ok: true };
}

export function emergencyRepairDice(level: number): number {
  return Math.max(1, Math.floor(level / 2));
}

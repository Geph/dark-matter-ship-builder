import type { Ship } from './types';
import { SYSTEMS_BY_ID } from '../data/systems';
import { UPGRADES_BY_ID } from '../data/upgrades';
import { WEAPONS_BY_NAME } from '../data/weapons';
import { CREW_ROLES } from '../data/crewRoles';
import { shipDimensions } from '../data/shipStats';
import { effectiveDmClass, slotsUsed, syncFighterBays, fighterBayMhp, fighterBayShieldPoints, fighterSlotsUsed, fighterSlotCapacity } from './rules';
import { fighterDisplayName, fighterHullById, resolveFighterBayHull } from '../data/fighters';

// Builds the plain-text stat block used by "Copy to Clipboard".

const LINE = '═'.repeat(47);
const THIN = '─'.repeat(47);

export function shipToText(ship: Ship): string {
  const lines: string[] = [];
  const dm = effectiveDmClass(ship);
  const used = slotsUsed(ship);

  lines.push(LINE);
  lines.push(`  ${(ship.name || 'UNNAMED').toUpperCase()}  •  ${ship.size}  •  DM Class ${dm}`);
  lines.push(LINE);
  const mhpNow = ship.mhpCurrent ?? ship.mhp;
  const shieldNow = ship.shieldCurrent ?? ship.shieldPoints;
  lines.push(`  MHP: ${mhpNow}/${ship.mhp}   AC: ${ship.ac}   SP: ${shieldNow}/${ship.shieldPoints}`);
  lines.push(`  Speed: ${ship.speed.toLocaleString()} ft  •  Maneuverability: ${ship.maneuverability}°`);
  lines.push(`  Slots: ${used}/${ship.totalSlots}`);
  lines.push(`  Cargo: ${ship.cargo.toLocaleString()} tons  •  Passengers: ${ship.passengers}`);
  lines.push(`  Dimensions: ${shipDimensions(ship.size, ship.dimensionsOverride)}`);
  if (ship.isFighterBuild) {
    lines.push('  GM custom fighter (not the standard ship-creation budget).');
    const trait = fighterHullById(ship.fighterHullId)?.trait;
    if (trait) lines.push(`  ${trait}`);
  }

  lines.push(THIN);
  lines.push('  SYSTEMS');
  const systemEntries = Object.entries(ship.systems).filter(([, c]) => c > 0);
  if (systemEntries.length === 0) lines.push('  (none)');
  for (const [id, count] of systemEntries) {
    const def = SYSTEMS_BY_ID[id];
    if (!def) continue;
    lines.push(`  • ${def.name}${count > 1 ? ` ×${count}` : ''}`);
  }

  lines.push(THIN);
  lines.push('  WEAPONS');
  if (ship.weapons.length === 0) lines.push('  (none)');
  for (const w of ship.weapons) {
    const def = WEAPONS_BY_NAME[w.name];
    if (!def) continue;
    lines.push(`  • ${def.name} [${w.facing}] — ${def.damage}`);
    lines.push(`      ${def.properties} | Mastery: ${def.mastery}`);
  }

  lines.push(THIN);
  lines.push('  UPGRADES');
  if (ship.upgrades.length === 0) lines.push('  (none)');
  for (const id of ship.upgrades) {
    const def = UPGRADES_BY_ID[id];
    if (def) lines.push(`  • ${def.name}`);
  }

  const bays = syncFighterBays(ship);
  if (bays.length > 0) {
    lines.push(THIN, '  FIGHTER BAYS');
    bays.forEach((bay, index) => {
      lines.push(`  ${index + 1}. ${fighterDisplayName(bay)}`);
      const hull = resolveFighterBayHull(bay);
      if (!hull) return;
      lines.push(`    MHP: ${fighterBayMhp(bay)} • AC: ${hull.ac} • SP: ${fighterBayShieldPoints(bay)}`);
      lines.push(`    Speed: ${hull.speed.toLocaleString()} ft • Maneuverability: ${hull.maneuverability}° • Slots: ${fighterSlotsUsed(bay)}/${fighterSlotCapacity(bay)}`);
      lines.push(`    Pilot level: ${bay.pilotLevel ?? 'NPC / stock MHP'}`);
      if (hull.trait) lines.push(`    ${hull.trait}`);
      for (const [id, count] of Object.entries(bay.systems)) {
        if (count > 0) lines.push(`    • ${SYSTEMS_BY_ID[id]?.name ?? id} ×${count}`);
      }
      for (const weapon of bay.weapons) {
        lines.push(`    • ${weapon.name} [${weapon.facing}] — ${WEAPONS_BY_NAME[weapon.name]?.damage ?? 'unknown weapon'}`);
      }
    });
  }

  lines.push(THIN);
  lines.push('  DESCRIPTION');
  if (ship.appearance) lines.push(`  Appearance: ${ship.appearance}`);
  if (ship.condition) lines.push(`  Condition: ${ship.condition}`);
  if (ship.interior) lines.push(`  Interior: ${ship.interior}`);
  if (ship.uniqueTrait) lines.push(`  Unique: ${ship.uniqueTrait}`);
  const crewLabels = ship.crewRoles
    .map((id) => CREW_ROLES.find((r) => r.id === id)?.label ?? id)
    .join(', ');
  if (crewLabels) lines.push(`  Crew: ${crewLabels}`);

  lines.push(LINE);
  return lines.join('\n');
}

import type { Ship } from './types';
import { SYSTEMS_BY_ID } from '../data/systems';
import { UPGRADES_BY_ID } from '../data/upgrades';
import { WEAPONS_BY_NAME } from '../data/weapons';
import { CREW_ROLES } from '../data/crewRoles';
import { effectiveDmClass, slotsUsed } from './rules';

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
  lines.push(`  MHP: ${ship.mhp}   AC: ${ship.ac}   SP: ${ship.shieldPoints}`);
  lines.push(`  Speed: ${ship.speed.toLocaleString()} ft  •  Maneuverability: ${ship.maneuverability}°`);
  lines.push(`  Slots: ${used}/${ship.totalSlots}`);
  lines.push(`  Cargo: ${ship.cargo.toLocaleString()} tons  •  Passengers: ${ship.passengers}`);

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

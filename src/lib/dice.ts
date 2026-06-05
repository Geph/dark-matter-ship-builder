// ============================================================
// Dice rolling helpers for ship combat actions.
// ============================================================

export interface DiceRollResult {
  rolls: number[];
  total: number;
  modifier: number;
  label: string;
}

/** Roll NdS and optionally add a flat modifier. */
export function rollDice(
  count: number,
  sides: number,
  modifier = 0,
  label?: string,
): DiceRollResult {
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  const sum = rolls.reduce((a, b) => a + b, 0);
  return {
    rolls,
    total: sum + modifier,
    modifier,
    label: label ?? `${count}d${sides}${modifier ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`,
  };
}

/** Roll 1d20 plus modifier (attack rolls). */
export function rollD20(modifier = 0): DiceRollResult {
  const roll = Math.floor(Math.random() * 20) + 1;
  return {
    rolls: [roll],
    total: roll + modifier,
    modifier,
    label: `1d20${modifier ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`,
  };
}

/**
 * Parse weapon damage strings like "2d8 Mega Piercing" or "4d10 Mega Force".
 * Returns null if no dice notation is found.
 */
export function parseDamageDice(damage: string): { count: number; sides: number } | null {
  const match = damage.match(/(\d+)d(\d+)/i);
  if (!match) return null;
  return { count: Number(match[1]), sides: Number(match[2]) };
}

/** Roll damage from a weapon damage string. */
export function rollWeaponDamage(damage: string, modifier = 0): DiceRollResult | null {
  const parsed = parseDamageDice(damage);
  if (!parsed) return null;
  const clean = damage.replace(/\s*Mega.*/i, '').trim();
  return rollDice(parsed.count, parsed.sides, modifier, clean || damage);
}

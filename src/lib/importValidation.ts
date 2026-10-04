import type { Ship } from './types';

export const MAX_IMPORT_BYTES = 10 * 1024 * 1024;
const MAX_ITEMS = 100;
const forbiddenKeys = new Set(['__proto__', 'prototype', 'constructor']);
const facings = new Set(['Forward', 'Aft', 'Port', 'Starboard', 'Turret']);

function fail(field: string): never { throw new Error(`Invalid ship import: ${field}.`); }
function record(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(field);
  if (Object.keys(value).some((key) => forbiddenKeys.has(key))) fail(`${field} contains a reserved key`);
  return value as Record<string, unknown>;
}
function string(value: unknown, field: string, max = 20_000): void {
  if (typeof value !== 'string' || value.length > max || forbiddenKeys.has(value)) fail(field);
}
function number(value: unknown, field: string, min: number, max: number, integer = false): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) fail(field);
}
function array(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value) || value.length > MAX_ITEMS) fail(`${field} must contain at most ${MAX_ITEMS} items`);
  return value;
}
function strings(value: unknown, field: string): void { array(value, field).forEach((v) => string(v, field)); }
function systems(value: unknown): void {
  const entries = Object.entries(record(value, 'systems'));
  if (entries.length > MAX_ITEMS) fail('too many systems');
  for (const [key, count] of entries) { string(key, 'system id', 100); number(count, 'system count', 0, MAX_ITEMS, true); }
}
function weapons(value: unknown): void {
  for (const item of array(value, 'weapons')) {
    const w = record(item, 'weapon'); string(w.name, 'weapon name', 100);
    if (typeof w.facing !== 'string' || !facings.has(w.facing)) fail('weapon facing');
  }
}
function image(value: unknown): void {
  if (value == null) return;
  if (typeof value !== 'string' || value.length > 800_000 || !/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value)) fail('portrait must be a bounded raster image data URL');
}

/** Structural limits at the file and persistence boundaries; gameplay errors remain editable. */
export function validateImportedShips(values: unknown[]): Ship[] {
  array(values, 'ships');
  for (const value of values) {
    const s = record(value, 'ship');
    string(s.id, 'id', 200); string(s.name, 'name');
    number(s.level, 'level', 1, 20, true); number(s.players, 'players', 1, 100, true);
    if (!['Fighter', 'Personal', 'Transport', 'Corvette', 'Frigate', 'Cruiser', 'Capital'].includes(String(s.size))) fail('size');
    systems(s.systems); weapons(s.weapons); strings(s.crewRoles, 'crew roles'); strings(s.upgrades, 'upgrades');
    for (const key of ['isFighterBuild']) if (s[key] != null && typeof s[key] !== 'boolean') fail(key);
    for (const key of ['appearance', 'condition', 'interior', 'uniqueTrait', 'createdAt', 'updatedAt', 'shareToken', 'dimensionsOverride', 'iconId', 'fighterHullId', 'userId']) {
      if (s[key] != null) string(s[key], key);
    }
    for (const key of ['mhp', 'mhpCurrent', 'shieldPoints', 'shieldCurrent', 'speed', 'maneuverability', 'cargo', 'passengers', 'totalSlots', 'creditsSpent', 'creditBudgetOverride', 'ac']) {
      if (s[key] != null) number(s[key], key, 0, 1_000_000_000);
    }
    for (const key of ['darkMatterClass', 'upgradedDmClass']) if (s[key] != null) number(s[key], key, 0, 9, true);
    image(s.shipImageDataUrl);
    if (s.megaSpells != null) strings(s.megaSpells, 'mega spells');
    if (s.crewMembers != null) {
      const members = Object.entries(record(s.crewMembers, 'crew members'));
      if (members.length > MAX_ITEMS) fail('too many crew members');
      for (const [id, raw] of members) {
        string(id, 'crew role', 100); const member = record(raw, 'crew member');
        if (member.name != null) string(member.name, 'crew name');
        for (const key of ['attackBonus', 'skillModifier', 'abilityModifier', 'damageModifier']) if (member[key] != null) number(member[key], key, -100, 100);
        if (member.megaSpells != null) strings(member.megaSpells, 'mega spells');
        image(member.imageDataUrl);
      }
    }
    if (s.fighterBays != null) for (const raw of array(s.fighterBays, 'fighter bays')) {
      const bay = record(raw, 'fighter bay');
      string(bay.type, 'bay type', 100);
      for (const key of ['catalogId', 'displayName', 'customShipId']) if (bay[key] != null) string(bay[key], key);
      if (bay.systems != null) systems(bay.systems);
      if (bay.weapons != null) weapons(bay.weapons);
      if (bay.pilotLevel != null) number(bay.pilotLevel, 'pilot level', 1, 20, true);
    }
  }
  return values as Ship[];
}

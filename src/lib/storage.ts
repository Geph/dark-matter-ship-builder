import type { FighterBaySlot, Ship } from './types';
import { statsForLevel } from '../data/shipStats';
import { fighterHullById, FIGHTER_SLOT_COUNT } from '../data/fighters';
import { computeCreditsSpent, computeShieldPoints, syncFighterBays } from './rules';

// ============================================================
// Persistence layer. Currently backed by the browser's
// localStorage so the app works offline with zero config.
//
// This module is the ONLY place that touches storage, so it can
// be swapped for a real backend (Supabase / Postgres / Mongo)
// without changing any UI code — just reimplement these
// async-shaped functions against your API. See README.
// ============================================================

const STORAGE_KEY = 'dm-ship-builder.ships.v1';

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function emptyShip(): Ship {
  const now = new Date().toISOString();
  const base = statsForLevel(1);
  return {
    id: uuid(),
    userId: null,
    name: '',
    iconId: null,
    shipImageDataUrl: null,
    level: 1,
    players: 1,
    isFighterBuild: false,
    fighterHullId: null,
    size: base.size,
    darkMatterClass: base.dmClass,
    mhp: base.mhp,
    mhpCurrent: null,
    ac: base.ac,
    shieldPoints: 0,
    shieldCurrent: null,
    speed: base.speed,
    maneuverability: base.maneuverability,
    totalSlots: base.slots,
    cargo: base.cargo,
    passengers: base.passengers,
    dimensionsOverride: null,
    crewRoles: [],
    crewMembers: {},
    systems: {},
    weapons: [],
    fighterBays: [],
    creditBudgetOverride: null,
    upgrades: [],
    upgradedDmClass: null,
    appearance: '',
    condition: '',
    interior: '',
    uniqueTrait: '',
    creditsSpent: 0,
    createdAt: now,
    updatedAt: now,
    shareToken: uuid(),
  };
}

/**
 * Recompute all level-derived stats + shields + credit totals.
 * Always run this before persisting so saved data is consistent.
 */
export function recomputeShip(ship: Ship): Ship {
  const base = statsForLevel(ship.level);
  let next: Ship = { ...ship };

  if (ship.isFighterBuild) {
    const hull = fighterHullById(ship.fighterHullId ?? 'sabre');
    next = {
      ...next,
      players: 1,
      size: 'Fighter',
      darkMatterClass: 0,
      mhp: hull?.mhp ?? 25,
      ac: hull?.ac ?? 13,
      speed: hull?.speed ?? 3500,
      maneuverability: hull?.maneuverability ?? 180,
      totalSlots: FIGHTER_SLOT_COUNT,
      cargo: 0,
      passengers: 1,
      upgradedDmClass: null,
      fighterHullId: ship.fighterHullId ?? 'sabre',
    };
    if (!next.crewRoles.includes('pilot')) {
      next.crewRoles = ['pilot'];
    }
    next.crewRoles = next.crewRoles.filter((r) => r === 'pilot');
  } else {
    next = {
      ...next,
      size: base.size,
      darkMatterClass: base.dmClass,
      mhp: base.mhp,
      ac: base.ac,
      speed: base.speed,
      maneuverability: base.maneuverability,
      totalSlots: base.slots,
      cargo: base.cargo,
      passengers: base.passengers,
    };
  }
  next.fighterBays = syncFighterBays(next);
  next.shieldPoints = computeShieldPoints(next);
  if (next.mhpCurrent != null) {
    next.mhpCurrent = Math.min(Math.max(0, next.mhpCurrent), next.mhp);
  }
  if (next.shieldCurrent != null) {
    next.shieldCurrent = Math.min(Math.max(0, next.shieldCurrent), next.shieldPoints);
  }
  next.creditsSpent = computeCreditsSpent(next);
  return next;
}

function fixWeaponName(name: string): string {
  return name === 'Pulse Cannon' ? 'Pulse Beam' : name;
}

/** Backfill fields added after initial release. */
function normalizeShip(ship: Ship & { megaSpells?: string[] }): Ship {
  const crewMembers = { ...(ship.crewMembers ?? {}) };
  const legacyMega = ship.megaSpells ?? [];
  if (legacyMega.length > 0) {
    const gunner = crewMembers.gunner ?? {
      name: '',
      skillModifier: 0,
      attackBonus: 0,
      megaSpells: [],
    };
    if (!gunner.megaSpells?.length) {
      crewMembers.gunner = { ...gunner, megaSpells: legacyMega };
    }
  }
  for (const [roleId, member] of Object.entries(crewMembers)) {
    crewMembers[roleId] = {
      name: member.name ?? '',
      skillModifier: member.skillModifier ?? 0,
      attackBonus: member.attackBonus ?? 0,
      megaSpells: member.megaSpells ?? [],
    };
  }
  const { megaSpells: _legacy, ...rest } = ship;
  return {
    ...rest,
    crewMembers,
    iconId: rest.iconId ?? null,
    shipImageDataUrl: rest.shipImageDataUrl ?? null,
    fighterBays: (rest.fighterBays ?? []).map((bay) => {
      const legacy = bay as FighterBaySlot & { customName?: string; type?: string };
      const rawType = String(legacy.type ?? 'none');
      const type: FighterBaySlot['type'] =
        rawType === 'custom' ? 'catalog' : (rawType as FighterBaySlot['type']);
      return {
        type,
        catalogId: legacy.catalogId ?? (type === 'catalog' ? 'sabre' : null),
        customShipId: (legacy as FighterBaySlot & { customShipId?: string }).customShipId ?? null,
        weapons: (legacy.weapons ?? []).map((w) => ({
          ...w,
          name: fixWeaponName(w.name),
        })),
      };
    }),
    weapons: (rest.weapons ?? []).map((w) => ({
      ...w,
      name: fixWeaponName(w.name),
    })),
    dimensionsOverride: rest.dimensionsOverride ?? null,
    creditBudgetOverride: rest.creditBudgetOverride ?? null,
    mhpCurrent: rest.mhpCurrent ?? null,
    shieldCurrent: rest.shieldCurrent ?? null,
    isFighterBuild: rest.isFighterBuild ?? false,
    fighterHullId: rest.fighterHullId ?? null,
  };
}

function readAll(): Ship[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Ship[];
    return Array.isArray(parsed) ? parsed.map(normalizeShip) : [];
  } catch {
    return [];
  }
}

function writeAll(ships: Ship[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ships));
}

export function listShips(): Ship[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getShip(id: string): Ship | undefined {
  return readAll().find((s) => s.id === id);
}

export function getShipByShareToken(token: string): Ship | undefined {
  return readAll().find((s) => s.shareToken === token);
}

export function saveShip(ship: Ship): Ship {
  const all = readAll();
  const recomputed = recomputeShip({ ...ship, updatedAt: new Date().toISOString() });
  const idx = all.findIndex((s) => s.id === ship.id);
  if (idx >= 0) all[idx] = recomputed;
  else all.push(recomputed);
  writeAll(all);
  return recomputed;
}

export function deleteShip(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function duplicateShip(id: string): Ship | undefined {
  const ship = getShip(id);
  if (!ship) return undefined;
  const now = new Date().toISOString();
  const copy: Ship = {
    ...structuredClone(ship),
    id: uuid(),
    shareToken: uuid(),
    name: `${ship.name || 'Untitled'} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };
  return saveShip(copy);
}

export { uuid };

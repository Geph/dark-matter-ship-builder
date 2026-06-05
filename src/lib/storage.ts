import type { Ship } from './types';
import { statsForLevel } from '../data/shipStats';
import { computeCreditsSpent, computeShieldPoints } from './rules';

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
    level: 1,
    players: 1,
    size: base.size,
    darkMatterClass: base.dmClass,
    mhp: base.mhp,
    ac: base.ac,
    shieldPoints: 0,
    speed: base.speed,
    maneuverability: base.maneuverability,
    totalSlots: base.slots,
    cargo: base.cargo,
    passengers: base.passengers,
    crewRoles: [],
    systems: {},
    weapons: [],
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
  const next: Ship = {
    ...ship,
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
  next.shieldPoints = computeShieldPoints(next);
  next.creditsSpent = computeCreditsSpent(next);
  return next;
}

function readAll(): Ship[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Ship[];
    return Array.isArray(parsed) ? parsed : [];
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

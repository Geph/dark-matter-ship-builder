import type { FighterBaySlot, FighterType, Ship, ShipSize, ShipWeapon, WeaponFacing } from './types';
import { fighterHullById, resolveFighterBayHull } from '../data/fighters';
import { SYSTEMS_BY_ID, HULL_EMBEDDED_SYSTEM_IDS, type SystemDef } from '../data/systems';
import { UPGRADES_BY_ID, DM_ENGINE_COSTS, type UpgradeDef } from '../data/upgrades';
import { WEAPONS_BY_NAME, type WeaponDef } from '../data/weapons';
import { CREW_ROLES_BY_ID, STARTING_SYSTEM_IDS } from '../data/crewRoles';

/** Starting systems granted free on a standard hull vs. a fighter build. */
export function startingSystemIds(ship: Ship): string[] {
  if (ship.isFighterBuild) return ['life-support', 'sensors'];
  return STARTING_SYSTEM_IDS;
}
import {
  SHIELD_POINTS_BY_SIZE,
  sizeRank,
  statsForLevel,
} from '../data/shipStats';

// ============================================================
// Isolated game-rule logic. UI components call these helpers
// rather than re-implementing rulebook math, so the rules can
// be audited against the Dark Matter rulebook in one place.
// ============================================================

/**
 * Credits budget (p.218): each player gets 1,000 CR + 150 CR per
 * character level beyond the first. Total budget pools all players.
 */
export function budgetForLevel(level: number, players: number): number {
  const perPlayer = 1000 + 150 * (Math.max(1, level) - 1);
  return perPlayer * Math.max(1, players);
}

/** Credit budget in effect — manual GM override or level-derived default. */
export function effectiveBudget(ship: Ship): number {
  if (ship.creditBudgetOverride != null && ship.creditBudgetOverride >= 0) {
    return ship.creditBudgetOverride;
  }
  return budgetForLevel(ship.level, ship.players);
}

export function fighterBayCount(ship: Ship): number {
  return ship.systems['fighter-bay'] ?? 0;
}

/** Keep fighter bay slots aligned with installed Fighter Bay count. */
export function syncFighterBays(ship: Ship): FighterBaySlot[] {
  const count = fighterBayCount(ship);
  const existing = ship.fighterBays ?? [];
  const bays: FighterBaySlot[] = [];
  for (let i = 0; i < count; i++) {
    bays.push(
      existing[i] ?? { type: 'none', catalogId: null, customShipId: null, weapons: [] },
    );
  }
  return bays;
}

export function fighterBayDeployCost(bay: FighterBaySlot): number {
  return resolveFighterBayHull(bay)?.cost ?? 0;
}

/**
 * Systems that are granted FOR FREE: the four starting systems
 * plus one system per chosen crew role (Dark Matter 5E, p.215, p.218).
 * Returns a map of systemId -> free instance count. The first N
 * installed instances of that system are not charged Credits.
 */
export function grantedSystemCounts(ship: Ship): Record<string, number> {
  const granted: Record<string, number> = {};
  for (const id of startingSystemIds(ship)) {
    granted[id] = (granted[id] ?? 0) + 1;
  }
  for (const roleId of ship.crewRoles) {
    const role = CREW_ROLES_BY_ID[roleId];
    if (role) granted[role.systemId] = (granted[role.systemId] ?? 0) + 1;
  }
  return granted;
}

/**
 * Ensure every granted (free) system is actually installed at least
 * the granted number of times. Returns a new systems map. Used after
 * crew roles change so auto-added systems appear in the loadout.
 */
/** Systems that must be manually installed — never auto-granted. */
export const NEVER_AUTO_INSTALL_IDS = ['escape-pod-fighter'];

export function withGrantedSystems(ship: Ship): Record<string, number> {
  const granted = grantedSystemCounts(ship);
  const systems = { ...ship.systems };
  for (const [id, count] of Object.entries(granted)) {
    if (NEVER_AUTO_INSTALL_IDS.includes(id)) continue;
    systems[id] = Math.max(systems[id] ?? 0, count);
  }
  return systems;
}

/** The Dark Matter engine class actually in effect (base, or upgraded). */
export function effectiveDmClass(ship: Ship): number {
  if (ship.isFighterBuild) return 0;
  const base = statsForLevel(ship.level).dmClass;
  return ship.upgradedDmClass != null ? Math.max(base, ship.upgradedDmClass) : base;
}

/**
 * Total credits spent: systems (× count) + weapons + upgrades +
 * the cumulative cost of upgrading the Dark Matter engine.
 */
export function computeCreditsSpent(ship: Ship): number {
  let total = 0;
  const granted = grantedSystemCounts(ship);

  for (const [id, count] of Object.entries(ship.systems)) {
    const def = SYSTEMS_BY_ID[id];
    if (!def) continue;
    // The first `granted[id]` instances are free; charge for the rest.
    const billable = Math.max(0, count - (granted[id] ?? 0));
    total += def.cost * billable;
  }

  for (const w of ship.weapons) {
    const def = WEAPONS_BY_NAME[w.name];
    if (def) total += def.cost;
  }

  for (const id of ship.upgrades) {
    const def = UPGRADES_BY_ID[id];
    if (def) total += def.cost;
  }

  if (!ship.isFighterBuild) {
    total += dmEngineUpgradeCost(ship);
  }

  for (const bay of syncFighterBays(ship)) {
    total += fighterBayDeployCost(bay);
  }

  return total;
}

/**
 * Cumulative cost of upgrading the engine from the base class
 * (set by level) up to the chosen class. Each intermediate class
 * is purchased in turn per the Dark Matter Engine Upgrade table.
 */
export function dmEngineUpgradeCost(ship: Ship): number {
  if (ship.isFighterBuild) return 0;
  const base = statsForLevel(ship.level).dmClass;
  if (ship.upgradedDmClass == null || ship.upgradedDmClass <= base) return 0;
  let cost = 0;
  for (let c = base + 1; c <= ship.upgradedDmClass; c++) {
    cost += DM_ENGINE_COSTS[c] ?? 0;
  }
  return cost;
}

/** Slots used: 1 per system instance + 1 per weapon. Upgrades cost 0. */
export function slotsUsed(ship: Ship): number {
  const systemSlots = Object.values(ship.systems).reduce((a, b) => a + b, 0);
  return systemSlots + ship.weapons.length;
}

/** Shield Points from an installed Shield Generator, by size (p.219). */
export function computeShieldPoints(ship: Ship): number {
  const hasGenerator = (ship.systems['shield-generator'] ?? 0) > 0;
  if (!hasGenerator) return 0;
  let sp = SHIELD_POINTS_BY_SIZE[ship.size] ?? 0;
  // Expanded Shielding upgrade doubles shield capacity (rulebook upgrade).
  if (ship.upgrades.includes('expanded-shielding')) sp *= 2;
  return sp;
}

/** Max installs allowed for a system on a given ship size. */
export function maxInstallsForSystem(def: SystemDef, size: ShipSize): number {
  if (def.maxBySize) {
    const v = def.maxBySize[size];
    return v ?? 0; // size not present => not allowed
  }
  return def.maxInstalls ?? Infinity;
}

export interface PrereqResult {
  ok: boolean;
  reason?: string;
}

/** Can this system be installed (size prereq + repeat caps)? */
export function canInstallSystem(ship: Ship, def: SystemDef): PrereqResult {
  if (def.minSize && sizeRank(ship.size) < sizeRank(def.minSize)) {
    return { ok: false, reason: `Requires ${def.minSize} size or larger.` };
  }
  const current = ship.systems[def.id] ?? 0;
  const max = maxInstallsForSystem(def, ship.size);
  if (current >= max) {
    if (max === 0) return { ok: false, reason: `Not available on ${ship.size}-class ships.` };
    return { ok: false, reason: `Maximum of ${max} installed.` };
  }
  return { ok: true };
}

/** Can this upgrade be installed (size + Dark Matter class prereqs)? */
export function canInstallUpgrade(ship: Ship, def: UpgradeDef): PrereqResult {
  if (def.minSize && sizeRank(ship.size) < sizeRank(def.minSize)) {
    return { ok: false, reason: `Requires ${def.minSize} size or larger.` };
  }
  if (def.minDmClass != null && effectiveDmClass(ship) < def.minDmClass) {
    return { ok: false, reason: `Requires Dark Matter Engine Class ${def.minDmClass}+.` };
  }
  if (ship.upgrades.includes(def.id)) {
    return { ok: false, reason: 'Already installed.' };
  }
  return { ok: true };
}

/**
 * Full ship validation against the spec's rules list. Returns an
 * array of human-readable error strings (empty => valid).
 */
export function validateShip(ship: Ship): string[] {
  const errors: string[] = [];
  const budget = effectiveBudget(ship);
  const spent = computeCreditsSpent(ship);
  const used = slotsUsed(ship);

  // Rule 1: at least one Pilot's Seat or Fighter Bay.
  const pilots = ship.systems['pilots-seat'] ?? 0;
  const fighterBaysInstalled = ship.systems['fighter-bay'] ?? 0;
  if (pilots + fighterBaysInstalled < 1) {
    errors.push("Every ship needs at least one Pilot's Seat or Fighter Bay.");
  }

  // Rules 2,6,7,8,9: per-system size & repeat caps.
  for (const [id, count] of Object.entries(ship.systems)) {
    if (count <= 0) continue;
    const def = SYSTEMS_BY_ID[id];
    if (!def) continue;
    if (def.minSize && sizeRank(ship.size) < sizeRank(def.minSize)) {
      errors.push(`${def.name} requires ${def.minSize} size or larger.`);
    }
    const max = maxInstallsForSystem(def, ship.size);
    if (count > max) {
      errors.push(`${def.name}: ${count} installed but max is ${max} for ${ship.size}.`);
    }
  }

  // Rule 3: upgrade Dark Matter class & size prereqs.
  for (const id of ship.upgrades) {
    const def = UPGRADES_BY_ID[id];
    if (!def) continue;
    if (def.minSize && sizeRank(ship.size) < sizeRank(def.minSize)) {
      errors.push(`${def.name} requires ${def.minSize} size or larger.`);
    }
    if (def.minDmClass != null && effectiveDmClass(ship) < def.minDmClass) {
      errors.push(`${def.name} requires Dark Matter Engine Class ${def.minDmClass}+.`);
    }
  }

  // Rule 4: slots.
  if (used > ship.totalSlots) {
    errors.push(`Over slot capacity: ${used}/${ship.totalSlots} used.`);
  }

  // Rule 5: budget.
  if (spent > budget) {
    errors.push(`Over budget: ${spent.toLocaleString()} / ${budget.toLocaleString()} CR.`);
  }

  // Weapon mount rules: Fixed → arc facings only; non-Fixed → turret only.
  for (const w of ship.weapons) {
    const def = WEAPONS_BY_NAME[w.name];
    if (!def) continue;
    const mount = canMountWeapon(def, w.facing);
    if (!mount.ok) {
      errors.push(`${def.name} [${w.facing}]: ${mount.reason}`);
    }
  }

  const fighterSlots = syncFighterBays(ship);
  fighterSlots.forEach((bay, i) => {
    if (bay.type === 'none') return;
    for (const w of bay.weapons) {
      const def = WEAPONS_BY_NAME[w.name];
      if (!def) continue;
      const mount = canMountWeapon(def, w.facing);
      if (!mount.ok) {
        errors.push(`Fighter ${i + 1} — ${def.name} [${w.facing}]: ${mount.reason}`);
      }
    }
  });

  return errors;
}

/** Arc facings for Fixed weapons (not the turret). */
export const ARC_FACINGS: WeaponFacing[] = ['Forward', 'Port', 'Starboard', 'Aft'];

export function weaponHasFixed(def: WeaponDef): boolean {
  return def.properties.split(',').some((p) => p.trim().toLowerCase() === 'fixed');
}

/** Resolve the facing used when mounting a weapon. */
export function resolveMountFacing(def: WeaponDef, selectedFacing: WeaponFacing): WeaponFacing {
  return weaponHasFixed(def) ? selectedFacing : 'Turret';
}

/** Can this weapon be mounted on the given facing? */
export function canMountWeapon(def: WeaponDef, facing: WeaponFacing): PrereqResult {
  if (weaponHasFixed(def)) {
    if (facing === 'Turret') {
      return { ok: false, reason: 'Fixed weapons must mount on Fore, Port, Starboard, or Aft.' };
    }
    if (!ARC_FACINGS.includes(facing)) {
      return { ok: false, reason: 'Invalid arc facing.' };
    }
    return { ok: true };
  }
  if (facing !== 'Turret') {
    return { ok: false, reason: 'Non-fixed weapons automatically mount on the Turret.' };
  }
  return { ok: true };
}

/** Whether a system instance is hull-embedded (not a weapon mount). */
export function isHullEmbeddedSystem(systemId: string): boolean {
  return HULL_EMBEDDED_SYSTEM_IDS.includes(systemId);
}

/** Attack bonus from the Gunner crew member, or a level-derived default. */
export function gunnerAttackBonus(ship: Ship): number {
  const gunner = ship.crewMembers?.['gunner'];
  if (gunner && gunner.attackBonus !== 0) return gunner.attackBonus;
  if (gunner?.skillModifier) return gunner.skillModifier + 2;
  return Math.max(2, Math.floor(ship.level / 4) + 2);
}

/** Slots still available on the ship. May be negative if over capacity. */
export function slotsRemaining(ship: Ship): number {
  return ship.totalSlots - slotsUsed(ship);
}

/**
 * How many installs of this system cannot be removed because they
 * were granted for free by crew roles / starting systems.
 */
export function lockedInstalls(ship: Ship, systemId: string): number {
  return grantedSystemCounts(ship)[systemId] ?? 0;
}

// ------------------------------------------------------------
// Immutable mutators. UI calls these to add/remove loadout
// items; each returns a NEW ship object (never mutates input).
// ------------------------------------------------------------

/** Install one more instance of a system (caller should pre-check slots). */
export function installSystem(ship: Ship, systemId: string): Ship {
  const systems = { ...ship.systems };
  systems[systemId] = (systems[systemId] ?? 0) + 1;
  return { ...ship, systems };
}

/** Remove one instance of a system, never dropping below granted count. */
export function removeSystem(ship: Ship, systemId: string): Ship {
  const systems = { ...ship.systems };
  const locked = lockedInstalls(ship, systemId);
  const next = Math.max(locked, (systems[systemId] ?? 0) - 1);
  if (next <= 0) delete systems[systemId];
  else systems[systemId] = next;
  return { ...ship, systems };
}

/** Mount a weapon. Non-fixed weapons always go on the Turret. */
export function addWeapon(
  ship: Ship,
  name: string,
  facing: WeaponFacing = 'Forward',
): Ship {
  const def = WEAPONS_BY_NAME[name];
  if (!def) return { ...ship, weapons: [...ship.weapons, { name, facing }] };
  const resolved = resolveMountFacing(def, facing);
  const check = canMountWeapon(def, resolved);
  if (!check.ok) return ship;
  return { ...ship, weapons: [...ship.weapons, { name, facing: resolved }] };
}

/** Remove the weapon at a given index. */
export function removeWeaponAt(ship: Ship, index: number): Ship {
  return { ...ship, weapons: ship.weapons.filter((_, i) => i !== index) };
}

/** Set the fighter type for a bay and load book-default weapons. */
export function setFighterBayType(ship: Ship, bayIndex: number, type: FighterType): Ship {
  const bays = syncFighterBays(ship).map((bay, i) => {
    if (i !== bayIndex) return bay;
    const hull =
      type === 'catalog'
        ? null
        : resolveFighterBayHull({ type, catalogId: null, customShipId: null, weapons: [] });
    return {
      type,
      catalogId: type === 'catalog' ? (bay.catalogId ?? 'sabre') : null,
      customShipId: null,
      weapons: hull ? [...hull.defaultWeapons] : [],
    };
  });
  return { ...ship, fighterBays: bays };
}

export function setFighterBayCatalogId(
  ship: Ship,
  bayIndex: number,
  catalogId: string,
): Ship {
  const bays = syncFighterBays(ship).map((bay, i) => {
    if (i !== bayIndex) return bay;
    const hull = fighterHullById(catalogId);
    return {
      type: 'catalog' as FighterType,
      catalogId,
      customShipId: null,
      weapons: hull ? [...hull.defaultWeapons] : bay.weapons,
    };
  });
  return { ...ship, fighterBays: bays };
}

/** Populate a fighter bay from a user-saved fighter build. */
export function setFighterBayFromCustomShip(
  ship: Ship,
  bayIndex: number,
  customShip: Ship,
): Ship {
  const hullId = customShip.fighterHullId;
  const bays = syncFighterBays(ship).map((bay, i) => {
    if (i !== bayIndex) return bay;
    return {
      ...bay,
      type: 'catalog' as FighterType,
      catalogId: hullId ?? bay.catalogId,
      customShipId: customShip.id,
      weapons: [...customShip.weapons],
    };
  });
  return { ...ship, fighterBays: bays };
}

/** Set the catalog hull template for a standalone fighter build. */
export function setFighterBuildHull(ship: Ship, hullId: string): Ship {
  const hull = fighterHullById(hullId);
  return {
    ...ship,
    fighterHullId: hullId,
    weapons: hull ? [...hull.defaultWeapons] : ship.weapons,
  };
}

/** Mount a weapon on a deployed fighter. */
export function addFighterWeapon(
  ship: Ship,
  bayIndex: number,
  name: string,
  facing: WeaponFacing = 'Forward',
): Ship {
  const def = WEAPONS_BY_NAME[name];
  const bays = syncFighterBays(ship);
  const bay = bays[bayIndex];
  if (!bay || bay.type === 'none') return ship;

  const resolved = def ? resolveMountFacing(def, facing) : facing;
  if (def) {
    const check = canMountWeapon(def, resolved);
    if (!check.ok) return ship;
  }

  bays[bayIndex] = {
    ...bay,
    weapons: [...bay.weapons, { name, facing: resolved }],
  };
  return { ...ship, fighterBays: bays };
}

export function removeFighterWeaponAt(ship: Ship, bayIndex: number, index: number): Ship {
  const bays = syncFighterBays(ship);
  const bay = bays[bayIndex];
  if (!bay) return ship;
  bays[bayIndex] = {
    ...bay,
    weapons: bay.weapons.filter((_, i) => i !== index),
  };
  return { ...ship, fighterBays: bays };
}

/** Group fighter weapons by facing (for configuration diagram). */
export function fighterWeaponsByFacing(
  weapons: ShipWeapon[],
): Record<WeaponFacing, { weapon: ShipWeapon; index: number }[]> {
  const out: Record<WeaponFacing, { weapon: ShipWeapon; index: number }[]> = {
    Forward: [],
    Port: [],
    Starboard: [],
    Aft: [],
    Turret: [],
  };
  weapons.forEach((weapon, index) => {
    out[weapon.facing].push({ weapon, index });
  });
  return out;
}

/** Change the firing facing of the weapon at a given index. */
export function setWeaponFacing(
  ship: Ship,
  index: number,
  facing: WeaponFacing,
): Ship {
  const weapons = ship.weapons.map((w, i) => (i === index ? { ...w, facing } : w));
  return { ...ship, weapons };
}

/** All weapon facings used for the configuration diagram. */
export const FACINGS: WeaponFacing[] = ['Forward', 'Port', 'Starboard', 'Aft', 'Turret'];

/** Group mounted weapons by their facing, preserving original indices. */
export function weaponsByFacing(
  ship: Ship,
): Record<WeaponFacing, { weapon: ShipWeapon; index: number }[]> {
  const out: Record<WeaponFacing, { weapon: ShipWeapon; index: number }[]> = {
    Forward: [],
    Port: [],
    Starboard: [],
    Aft: [],
    Turret: [],
  };
  ship.weapons.forEach((weapon, index) => {
    out[weapon.facing].push({ weapon, index });
  });
  return out;
}

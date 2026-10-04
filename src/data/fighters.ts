import type { FighterBaySlot, ShipWeapon } from '../lib/types';

/** Default only; each catalog hull has its own capacity (pp. 238–243). */
export const FIGHTER_SLOT_COUNT = 6;

export interface FighterHullDef {
  id: string;
  name: string;
  subtitle: string;
  ac: number;
  mhp: number;
  speed: number;
  maneuverability: number;
  cost: number;
  slots: number;
  cargo: number; // tons (2,000 lb.)
  passengers: number;
  shieldPoints?: number;
  npcOnly?: boolean;
  gmOnly?: boolean;
  trait?: string;
  defaultSystems: Record<string, number>;
  defaultWeapons: ShipWeapon[];
}

/** General stats and loadouts, not NPC Combat attacks. Original IDs retain save compatibility. */
export const FIGHTER_CATALOG: FighterHullDef[] = [
  {
    "id": "battle-frame",
    "name": "Battleframe",
    "subtitle": "Lakshay; NPC frame (p. 238)",
    "ac": 13,
    "mhp": 20,
    "speed": 3000,
    "maneuverability": 360,
    "cost": 3550,
    "cargo": 0.25,
    "passengers": 0,
    "slots": 6,
    "defaultSystems": {
      "escape-pod-fighter": 1,
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Missile Pod",
        "facing": "Turret"
      },
      {
        "name": "Uchigatana",
        "facing": "Turret"
      }
    ],
    "npcOnly": true,
    "trait": "NPC Battleframe template. Player Battleframes use separate frame, armor, and upgrade rules (pp. 225–231, 237–238), not this custom fighter mode."
  },
  {
    "id": "cog",
    "name": "Cog",
    "subtitle": "Fighter",
    "ac": 13,
    "mhp": 20,
    "speed": 3000,
    "maneuverability": 180,
    "cost": 1850,
    "cargo": 0.5,
    "passengers": 1,
    "slots": 6,
    "defaultSystems": {
      "escape-pod-fighter": 1,
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Phase Beam",
        "facing": "Forward"
      }
    ],
    "trait": "Mechanical Design: functions normally in Dead Magic Zones."
  },
  {
    "id": "hammer",
    "name": "Hammer",
    "subtitle": "Fighter",
    "ac": 14,
    "mhp": 20,
    "speed": 3000,
    "maneuverability": 180,
    "cost": 2050,
    "cargo": 1,
    "passengers": 1,
    "slots": 6,
    "defaultSystems": {
      "escape-pod-fighter": 1,
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Mining Laser",
        "facing": "Turret"
      },
      {
        "name": "Ram",
        "facing": "Forward"
      }
    ],
    "trait": "Sturdy Design: critical hits do not disable a system."
  },
  {
    "id": "flying-car",
    "name": "Hovercar",
    "subtitle": "Fighter",
    "ac": 10,
    "mhp": 5,
    "speed": 3000,
    "maneuverability": 180,
    "cost": 800,
    "cargo": 0.5,
    "passengers": 7,
    "slots": 2,
    "defaultSystems": {
      "pilots-seat": 1
    },
    "defaultWeapons": [],
    "trait": "Hover Design: travels along the ground at an altitude of up to 10 feet."
  },
  {
    "id": "hovertank",
    "name": "Hovertank",
    "subtitle": "Fighter",
    "ac": 15,
    "mhp": 25,
    "speed": 1000,
    "maneuverability": 90,
    "cost": 1800,
    "cargo": 2,
    "passengers": 4,
    "slots": 6,
    "defaultSystems": {
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Heavy Cannon",
        "facing": "Forward"
      }
    ],
    "trait": "Hover Design: travels up to 10 feet above ground. Turret Design: may change Heavy Cannon facing at the start of its turn."
  },
  {
    "id": "interceptor",
    "name": "Interceptor",
    "subtitle": "Fighter",
    "ac": 13,
    "mhp": 15,
    "speed": 4000,
    "maneuverability": 180,
    "cost": 1850,
    "cargo": 0.5,
    "passengers": 0,
    "slots": 6,
    "defaultSystems": {
      "escape-pod-fighter": 1,
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Phase Beam",
        "facing": "Forward"
      }
    ],
    "trait": "Nimble Design: automatically succeeds on Dexterity (Piloting) checks for Evasive Maneuvers."
  },
  {
    "id": "pilgrim",
    "name": "Pilgrim",
    "subtitle": "Fighter",
    "ac": 13,
    "mhp": 20,
    "speed": 3000,
    "maneuverability": 180,
    "cost": 2000,
    "cargo": 0.25,
    "passengers": 0,
    "slots": 6,
    "defaultSystems": {
      "escape-pod-fighter": 1,
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Scorcher",
        "facing": "Turret"
      }
    ],
    "trait": "Vindictive Design: attack rolls have Advantage while Bloodied."
  },
  {
    "id": "pincer",
    "name": "Prawn",
    "subtitle": "Fighter",
    "ac": 14,
    "mhp": 45,
    "speed": 3500,
    "maneuverability": 180,
    "cost": 2650,
    "cargo": 1,
    "passengers": 2,
    "slots": 6,
    "defaultSystems": {
      "escape-pod-fighter": 1,
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Pneumatic Pincer",
        "facing": "Turret"
      },
      {
        "name": "Pneumatic Pincer",
        "facing": "Turret"
      }
    ],
    "trait": "Walking Design: ground Speed 100 feet."
  },
  {
    "id": "kill-rig",
    "name": "Rig",
    "subtitle": "Fighter",
    "ac": 13,
    "mhp": 20,
    "speed": 3000,
    "maneuverability": 180,
    "cost": 2550,
    "cargo": 0.75,
    "passengers": 3,
    "slots": 6,
    "defaultSystems": {
      "escape-pod-fighter": 1,
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Light Cannon",
        "facing": "Forward"
      },
      {
        "name": "Rip-Chain",
        "facing": "Forward"
      }
    ],
    "trait": "Industrial Design: Resistance to damage from Melee weapons."
  },
  {
    "id": "sabre",
    "name": "Saber",
    "subtitle": "Fighter",
    "ac": 13,
    "mhp": 20,
    "speed": 3000,
    "maneuverability": 180,
    "cost": 1850,
    "cargo": 0.5,
    "passengers": 1,
    "slots": 6,
    "defaultSystems": {
      "escape-pod-fighter": 1,
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Phase Beam",
        "facing": "Forward"
      }
    ],
    "trait": "Innovative Design: when hit by an attack roll, roll 1d6; on a 6 the attack misses."
  },
  {
    "id": "saucer",
    "name": "Saucer",
    "subtitle": "Fighter",
    "ac": 13,
    "mhp": 5,
    "speed": 3000,
    "maneuverability": 360,
    "cost": 2650,
    "cargo": 2,
    "passengers": 4,
    "slots": 6,
    "defaultSystems": {
      "escape-pod-fighter": 1,
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Lightning Coil",
        "facing": "Turret"
      }
    ],
    "shieldPoints": 8,
    "trait": "Advanced Design: 8 SP, including 4 extra SP. The printed stat block omits its Shield Generator; intrinsic shields are retained (p. 242)."
  },
  {
    "id": "shuttle",
    "name": "Shuttle",
    "subtitle": "Fighter",
    "ac": 10,
    "mhp": 10,
    "speed": 3000,
    "maneuverability": 180,
    "cost": 1200,
    "cargo": 1,
    "passengers": 8,
    "slots": 6,
    "defaultSystems": {
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": []
  },
  {
    "id": "swarmer",
    "name": "Swarmer",
    "subtitle": "Fighter",
    "ac": 13,
    "mhp": 10,
    "speed": 3500,
    "maneuverability": 360,
    "cost": 2000,
    "cargo": 0.25,
    "passengers": 0,
    "slots": 6,
    "defaultSystems": {
      "life-support": 1,
      "sensors": 1,
      "pilots-seat": 1
    },
    "defaultWeapons": [
      {
        "name": "Auto Turret",
        "facing": "Turret"
      }
    ]
  },
  {
    "id": "umbra",
    "name": "Umbra",
    "subtitle": "Fighter",
    "ac": 14,
    "mhp": 10,
    "speed": 4000,
    "maneuverability": 360,
    "cost": 400,
    "cargo": 0.05,
    "passengers": 0,
    "slots": 1,
    "defaultSystems": {
      "sensors": 1
    },
    "defaultWeapons": [],
    "gmOnly": true,
    "trait": "GM-only purchase. Organic Design: cannot be hacked or affected by ship-control spells. Uncrewed: controlled by a Stygian within 1,000 miles. Dark Pulse is an NPC combat action, not a purchasable weapon."
  }
];

export const FIGHTER_CATALOG_BY_ID: Record<string, FighterHullDef> = Object.fromEntries(

  FIGHTER_CATALOG.map((f) => [f.id, f]),

);

/** Map legacy bay type ids to catalog hull ids. */

const LEGACY_BAY_TYPE_TO_CATALOG: Record<string, string> = {

  sabre: 'sabre',

  interceptor: 'interceptor',

  rig: 'kill-rig',

  swarmer: 'swarmer',

};

export function emptyFighterBay(): FighterBaySlot {

  return {

    type: 'none',

    catalogId: null,

    displayName: '',

    systems: {},

    weapons: [],

  };

}

/** Rulebook stock loadout for a catalog hull (systems + weapons). */

export function defaultFighterBayLoadout(catalogId: string): Pick<FighterBaySlot, 'systems' | 'weapons'> {

  const hull = fighterHullById(catalogId);

  if (!hull) return { systems: {}, weapons: [] };

  return {

    systems: { ...hull.defaultSystems },

    weapons: hull.defaultWeapons.map((w) => ({ ...w })),

  };

}

export function resolveFighterBayHull(bay: FighterBaySlot): FighterHullDef | null {

  if (bay.type === 'none' || !bay.catalogId) return null;

  return fighterHullById(bay.catalogId);

}

export function fighterHullById(id: string | null | undefined): FighterHullDef | null {

  if (!id) return null;

  return FIGHTER_CATALOG_BY_ID[id === 'drone' ? 'swarmer' : id] ?? null;

}

export function fighterDisplayName(bay: FighterBaySlot): string {

  if (bay.type === 'none') return 'Empty Bay';

  const trimmed = bay.displayName?.trim();

  if (trimmed) return trimmed;

  const hull = resolveFighterBayHull(bay);

  return hull?.name ?? 'Unknown Fighter';

}

/** Normalize legacy fighter bay records from older saves. */

export function normalizeFighterBayType(raw: FighterBaySlot & { customShipId?: string | null }): FighterBaySlot {

  let type = raw.type as string;

  let catalogId = raw.catalogId;

  if (type === 'custom' || raw.customShipId) {

    type = 'catalog';

  }

  if (type !== 'none' && type !== 'catalog') {

    catalogId = LEGACY_BAY_TYPE_TO_CATALOG[type] ?? catalogId ?? 'sabre';

    type = 'catalog';

  }

  const normalized: FighterBaySlot = {

    type: type === 'catalog' ? 'catalog' : 'none',

    catalogId: type === 'catalog' ? (catalogId ?? 'sabre') : null,

    displayName: raw.displayName ?? '',
    pilotLevel: raw.pilotLevel ?? null,

    systems: { ...(raw.systems ?? {}) },

    weapons: [...(raw.weapons ?? [])],

  };

  if (normalized.type === 'catalog' && normalized.catalogId) {
    const stock = defaultFighterBayLoadout(normalized.catalogId);
    if (raw.systems == null) {
      normalized.systems = stock.systems;
    }
    if (raw.weapons == null) {
      normalized.weapons = stock.weapons;
    }
  }

  return normalized;

}


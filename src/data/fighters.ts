import type { FighterBaySlot, ShipWeapon } from '../lib/types';



// ============================================================

// Fighter-class hulls (Dark Matter Sci-Fi 5E ship catalog).

// ============================================================



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

  trait?: string;

  /** Rulebook stock systems (removable in the builder). */

  defaultSystems: Record<string, number>;

  defaultWeapons: ShipWeapon[];

}



const LS_SENSORS: Record<string, number> = { 'life-support': 1, sensors: 1 };

const SENSORS_ONLY: Record<string, number> = { sensors: 1 };



/** Full fighter classification table (p.130+). */

export const FIGHTER_CATALOG: FighterHullDef[] = [

  {

    id: 'battle-frame',

    name: 'Battle Frame',

    subtitle: 'Human walker-frame',

    ac: 14,

    mhp: 30,

    speed: 3000,

    maneuverability: 360,

    cost: 5750,

    defaultSystems: LS_SENSORS,

    defaultWeapons: [

      { name: 'Missile Barrage', facing: 'Turret' },

      { name: 'Uchigatana', facing: 'Turret' },

    ],

  },

  {

    id: 'cog',

    name: 'Cog',

    subtitle: 'Gnome fighter',

    ac: 13,

    mhp: 34,

    speed: 3000,

    maneuverability: 180,

    cost: 5750,

    defaultSystems: LS_SENSORS,

    defaultWeapons: [{ name: 'Light Cannon', facing: 'Forward' }],

  },

  {

    id: 'drone',

    name: 'Drone',

    subtitle: 'Vect fighter',

    ac: 13,

    mhp: 22,

    speed: 3500,

    maneuverability: 360,

    cost: 4500,

    trait:

      'Auto-Assault. Volatile Design — explodes for 4d6 mega fire when destroyed.',

    defaultSystems: SENSORS_ONLY,

    defaultWeapons: [

      { name: 'Auto Turret', facing: 'Turret' },

      { name: 'Auto Turret', facing: 'Turret' },

    ],

  },

  {

    id: 'flying-car',

    name: 'Flying Car',

    subtitle: 'Misc. fighter',

    ac: 10,

    mhp: 2,

    speed: 2000,

    maneuverability: 180,

    cost: 3500,

    defaultSystems: {},

    defaultWeapons: [],

  },

  {

    id: 'hammer',

    name: 'Hammer',

    subtitle: 'Dwarven fighter',

    ac: 14,

    mhp: 25,

    speed: 3000,

    maneuverability: 180,

    cost: 5000,

    defaultSystems: LS_SENSORS,

    defaultWeapons: [{ name: 'Pulse Beam', facing: 'Forward' }],

  },

  {

    id: 'hovertank',

    name: 'Hovertank',

    subtitle: 'Misc. fighter',

    ac: 14,

    mhp: 30,

    speed: 500,

    maneuverability: 180,

    cost: 5000,

    defaultSystems: {},

    defaultWeapons: [{ name: 'Pulse Cannon Turret', facing: 'Turret' }],

  },

  {

    id: 'interceptor',

    name: 'Interceptor',

    subtitle: 'Elven fighter',

    ac: 13,

    mhp: 25,

    speed: 4000,

    maneuverability: 180,

    cost: 5000,

    trait:

      'Nimble Design. On any turn this ship does not fire its weapons, its speed increases by 1,000 ft. for that turn.',

    defaultSystems: LS_SENSORS,

    defaultWeapons: [{ name: 'Pulse Beam', facing: 'Forward' }],

  },

  {

    id: 'landrunner',

    name: 'Landrunner',

    subtitle: 'Misc. fighter',

    ac: 10,

    mhp: 3,

    speed: 2500,

    maneuverability: 180,

    cost: 2500,

    defaultSystems: {},

    defaultWeapons: [],

  },

  {

    id: 'kill-rig',

    name: 'Kill-Rig',

    subtitle: 'Orcish fighter',

    ac: 13,

    mhp: 28,

    speed: 3000,

    maneuverability: 180,

    cost: 4000,

    trait:

      'Industrial Design. Resistance to damage from attacks that hit it in the front.',

    defaultSystems: LS_SENSORS,

    defaultWeapons: [

      { name: 'Light Cannon', facing: 'Forward' },

      { name: 'Rip-Chain', facing: 'Port' },

    ],

  },

  {

    id: 'pilgrim',

    name: 'Pilgrim',

    subtitle: 'Avia-Ra fighter',

    ac: 13,

    mhp: 25,

    speed: 3500,

    maneuverability: 180,

    cost: 5000,

    defaultSystems: LS_SENSORS,

    defaultWeapons: [{ name: 'Scorcher', facing: 'Turret' }],

  },

  {

    id: 'pincer',

    name: 'Pincer',

    subtitle: 'Nautilid fighter',

    ac: 14,

    mhp: 30,

    speed: 3500,

    maneuverability: 180,

    cost: 5500,

    defaultSystems: LS_SENSORS,

    defaultWeapons: [{ name: 'Pneumatic Pincer', facing: 'Turret' }],

  },

  {

    id: 'probe',

    name: 'Probe',

    subtitle: 'Misc. scout fighter',

    ac: 8,

    mhp: 1,

    speed: 1500,

    maneuverability: 360,

    cost: 2750,

    defaultSystems: {},

    defaultWeapons: [],

  },

  {

    id: 'sabre',

    name: 'Sabre',

    subtitle: 'Human (Hegemony) fighter',

    ac: 13,

    mhp: 25,

    speed: 3500,

    maneuverability: 180,

    cost: 5000,

    trait: 'Innovative Design. The crew has advantage on initiative rolls.',

    defaultSystems: LS_SENSORS,

    defaultWeapons: [{ name: 'Pulse Beam', facing: 'Forward' }],

  },

  {

    id: 'saucer',

    name: 'Saucer',

    subtitle: 'Amoeboid fighter',

    ac: 13,

    mhp: 20,

    speed: 3000,

    maneuverability: 180,

    cost: 5750,

    defaultSystems: LS_SENSORS,

    defaultWeapons: [{ name: 'Lightning Coil', facing: 'Turret' }],

  },

  {

    id: 'shuttle',

    name: 'Shuttle',

    subtitle: 'Misc. fighter',

    ac: 10,

    mhp: 2,

    speed: 1500,

    maneuverability: 180,

    cost: 5000,

    defaultSystems: SENSORS_ONLY,

    defaultWeapons: [],

  },

  {

    id: 'umbra',

    name: 'Umbra',

    subtitle: 'Wrothian fighter',

    ac: 11,

    mhp: 15,

    speed: 3500,

    maneuverability: 180,

    cost: 0,

    defaultSystems: {},

    defaultWeapons: [{ name: 'Dark Pulse', facing: 'Turret' }],

  },

  {

    id: 'swarmer',

    name: 'Swarmer',

    subtitle: 'Vect swarm fighter (Drone-class)',

    ac: 13,

    mhp: 22,

    speed: 3500,

    maneuverability: 360,

    cost: 4500,

    trait:

      'Auto-Assault. Volatile Design — explodes for 4d6 mega fire when destroyed.',

    defaultSystems: SENSORS_ONLY,

    defaultWeapons: [

      { name: 'Auto Turret', facing: 'Turret' },

      { name: 'Auto Turret', facing: 'Turret' },

    ],

  },

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

  return FIGHTER_CATALOG_BY_ID[bay.catalogId] ?? null;

}



export function fighterHullById(id: string | null | undefined): FighterHullDef | null {

  if (!id) return null;

  return FIGHTER_CATALOG_BY_ID[id] ?? null;

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

    systems: { ...(raw.systems ?? {}) },

    weapons: [...(raw.weapons ?? [])],

  };



  if (normalized.type === 'catalog' && normalized.catalogId) {
    const stock = defaultFighterBayLoadout(normalized.catalogId);
    if (Object.keys(normalized.systems).length === 0 && Object.keys(stock.systems).length > 0) {
      normalized.systems = stock.systems;
    }
    if (normalized.weapons.length === 0 && stock.weapons.length > 0) {
      normalized.weapons = stock.weapons;
    }
  }



  return normalized;

}



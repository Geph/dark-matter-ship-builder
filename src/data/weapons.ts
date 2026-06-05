// ============================================================
// Ship Weapons (Dark Matter Sci-Fi 5E, pp.219-220)
// Each weapon occupies 1 slot. Stats hardcoded from the
// rulebook tables for easy auditing.
// ============================================================

export interface WeaponDef {
  id: string;
  name: string;
  damage: string;
  category: 'Ranged' | 'Melee';
  type: 'Simple' | 'Martial';
  properties: string;
  mastery: string;
  cost: number;
}

export const RANGED_WEAPONS: WeaponDef[] = [
  { id: 'light-cannon', name: 'Light Cannon', damage: '2d8 Mega Piercing', category: 'Ranged', type: 'Simple', properties: 'Ammo (4k/12k; Shell), Firearm, Fixed, Kinetic, Mega', mastery: 'Push', cost: 500 },
  { id: 'mining-laser', name: 'Mining Laser', damage: '2d6 Mega Radiant', category: 'Ranged', type: 'Simple', properties: 'Blaster (2k/6k), Firearm, Mega', mastery: 'Slow', cost: 400 },
  { id: 'phase-beam', name: 'Phase Beam', damage: '2d8 Mega Radiant', category: 'Ranged', type: 'Simple', properties: 'Blaster (4k/12k), Firearm, Fixed, Mega', mastery: 'Vex', cost: 600 },
  { id: 'scorcher', name: 'Scorcher', damage: '2d6 Mega Fire', category: 'Ranged', type: 'Simple', properties: 'Blaster (2k/6k), Firearm, Mega', mastery: 'Bypass', cost: 750 },
  { id: 'auto-turret', name: 'Auto Turret', damage: '2d8 Mega Radiant', category: 'Ranged', type: 'Martial', properties: 'Blaster (2.5k/7.5k), Firearm, Mega', mastery: 'Automatic', cost: 800 },
  { id: 'heavy-cannon', name: 'Heavy Cannon', damage: '2d10 Mega Piercing', category: 'Ranged', type: 'Martial', properties: 'Ammo (5k/15k; Shell), Firearm, Fixed, Kinetic, Mega', mastery: 'Push', cost: 1000 },
  { id: 'lightning-coil', name: 'Lightning Coil', damage: '2d8 Mega Lightning', category: 'Ranged', type: 'Martial', properties: 'Blaster (3k/9k), Firearm, Mega', mastery: 'Slow', cost: 900 },
  { id: 'neutron-torpedo', name: 'Neutron Torpedo', damage: '4d8 Mega Force', category: 'Ranged', type: 'Martial', properties: 'Ammo (6k/18k; Torpedo), Firearm, Mega, Recharge', mastery: 'Bypass', cost: 3000 },
  { id: 'pulse-beam', name: 'Pulse Beam', damage: '2d10 Mega Radiant', category: 'Ranged', type: 'Martial', properties: 'Blaster (5k/15k), Firearm, Fixed, Mega', mastery: 'Vex', cost: 1000 },
  { id: 'railgun', name: 'Railgun', damage: '4d10 Mega Force', category: 'Ranged', type: 'Martial', properties: 'Ammo (6k/18k; Slug), Firearm, Fixed, Kinetic, Mega, Recharge', mastery: 'Push', cost: 4000 },
];

export const MELEE_WEAPONS: WeaponDef[] = [
  { id: 'asteroid-drill', name: 'Asteroid Drill', damage: '1d6 Mega Piercing', category: 'Melee', type: 'Simple', properties: 'Finesse, Mega', mastery: 'Vex', cost: 550 },
  { id: 'ram', name: 'Ram', damage: '1d8 Mega Bludgeoning', category: 'Melee', type: 'Simple', properties: 'Fixed, Mega', mastery: 'Push', cost: 400 },
  { id: 'plasma-lance', name: 'Plasma Lance', damage: '2d10 Mega Fire', category: 'Melee', type: 'Martial', properties: 'Fixed, Mega, Recharge', mastery: 'Bypass', cost: 1500 },
  { id: 'pneumatic-pincer', name: 'Pneumatic Pincer', damage: '1d8 Mega Bludgeoning', category: 'Melee', type: 'Martial', properties: 'Mega', mastery: 'Slow', cost: 700 },
  { id: 'rip-chain', name: 'Rip-Chain', damage: '1d10 Mega Slashing', category: 'Melee', type: 'Martial', properties: 'Fixed, Mega', mastery: 'Graze', cost: 800 },
];

export const ALL_WEAPONS: WeaponDef[] = [...RANGED_WEAPONS, ...MELEE_WEAPONS];

export const WEAPONS_BY_NAME: Record<string, WeaponDef> = Object.fromEntries(
  ALL_WEAPONS.map((w) => [w.name, w]),
);

// ============================================================
// Mega Spells (Dark Matter Sci-Fi 5E, pp. 402–405).
// Fired through an Arcane Cannon by the Gunner's spellcaster ally.
// ============================================================

export interface MegaSpellDef {
  id: string;
  name: string;
  level: number;
  school: string;
  description: string;
  damage: string;
  /** Saving throw ability abbreviation when the spell allows a save. */
  save?: 'Dex' | 'Con' | 'Wis' | 'Str' | 'Int' | 'Cha';
  saveEffect?: string;
}

export const MEGA_SPELLS: MegaSpellDef[] = [
  {
    id: 'conjure-asteroid',
    name: 'Conjure Asteroid',
    level: 3,
    school: 'Conjuration',
    description:
      'Hurl a massive asteroid at a ship. Mega-scale conjuration ideal for opening volleys.',
    damage: '4d8 Mega Bludgeoning',
    save: 'Dex',
    saveEffect: 'half on success',
  },
  {
    id: 'meteoroid-shower',
    name: 'Meteoroid Shower',
    level: 3,
    school: 'Conjuration',
    description: 'Rain a barrage of meteoroids across a wide swath of space.',
    damage: '3d8 Mega Fire',
    save: 'Dex',
    saveEffect: 'half on success',
  },
  {
    id: 'shield-burst',
    name: 'Shield Burst',
    level: 5,
    school: 'Abjuration',
    description:
      'Detonate a protective ward outward, battering nearby ships with repulsive force.',
    damage: '4d6 Mega Force',
    save: 'Con',
    saveEffect: 'half on success',
  },
  {
    id: 'eldritch-rift',
    name: 'Eldritch Rift',
    level: 7,
    school: 'Evocation',
    description: 'Tear open a rift of raw arcane energy that engulfs enemy vessels.',
    damage: '6d8 Mega Force',
    save: 'Dex',
    saveEffect: 'half on success',
  },
  {
    id: 'dark-matter-override',
    name: 'Dark Matter Override',
    level: 9,
    school: 'Transmutation',
    description:
      'Override local dark matter flow to catastrophically stress a target ship\'s hull.',
    damage: '8d10 Mega Force',
    save: 'Con',
    saveEffect: 'half on success',
  },
  {
    id: 'fireball-mega',
    name: 'Fireball',
    level: 3,
    school: 'Evocation',
    description:
      'A magnified fireball erupts in a 1,500-foot-radius sphere (cannon ×100). Instantaneous evocation.',
    damage: '8d6 Mega Fire',
    save: 'Dex',
    saveEffect: 'half on success',
  },
  {
    id: 'lightning-bolt-mega',
    name: 'Lightning Bolt',
    level: 3,
    school: 'Evocation',
    description: 'A 1,000-foot-long, 100-foot-wide bolt of lightning streaks through the void.',
    damage: '8d6 Mega Lightning',
    save: 'Dex',
    saveEffect: 'half on success',
  },
  {
    id: 'cone-of-cold-mega',
    name: 'Cone of Cold',
    level: 5,
    school: 'Evocation',
    description: 'A 600-foot cone of killing frost sweeps across enemy formations.',
    damage: '8d8 Mega Cold',
    save: 'Con',
    saveEffect: 'half on success',
  },
  {
    id: 'chain-lightning-mega',
    name: 'Chain Lightning',
    level: 6,
    school: 'Evocation',
    description: 'Lightning arcs between up to three ships within 3,000 feet of the primary target.',
    damage: '10d8 Mega Lightning',
    save: 'Dex',
    saveEffect: 'half on success',
  },
  {
    id: 'disintegrate-mega',
    name: 'Disintegrate',
    level: 6,
    school: 'Transmutation',
    description: 'A single-target beam that can reduce a ship section to dust on a failed save.',
    damage: '10d6+40 Mega Force',
    save: 'Dex',
    saveEffect: 'no effect on success',
  },
  {
    id: 'solar-wind-mega',
    name: 'Solar Wind',
    level: 4,
    school: 'Evocation',
    description: 'Channel stellar radiation into a searing wave of mega radiant damage.',
    damage: '5d10 Mega Radiant',
    save: 'Con',
    saveEffect: 'half on success',
  },
  {
    id: 'gravity-well-mega',
    name: 'Gravity Well',
    level: 5,
    school: 'Evocation',
    description: 'Crush and slow vessels caught in a localized gravity anomaly.',
    damage: '4d12 Mega Force',
    save: 'Str',
    saveEffect: 'half on success',
  },
  {
    id: 'zero-gravity-burst',
    name: 'Zero Gravity Burst',
    level: 7,
    school: 'Transmutation',
    description: 'Briefly nullify gravity across a vast area, slamming ships with inertial stress.',
    damage: '6d10 Mega Force',
    save: 'Dex',
    saveEffect: 'half on success',
  },
  {
    id: 'warp-rift',
    name: 'Warp Rift',
    level: 8,
    school: 'Conjuration',
    description: 'Open a unstable warp tear that shears through shields and hull plating.',
    damage: '8d12 Mega Force',
    save: 'Dex',
    saveEffect: 'half on success',
  },
  {
    id: 'antimatter-nova',
    name: 'Antimatter Nova',
    level: 8,
    school: 'Evocation',
    description: 'Detonate a sphere of annihilating energy with ruinous mega force output.',
    damage: '10d10 Mega Force',
    save: 'Dex',
    saveEffect: 'half on success',
  },
  {
    id: 'void-lance-mega',
    name: 'Void Lance',
    level: 4,
    school: 'Evocation',
    description: 'A focused lance of void energy pierces a single target ship.',
    damage: '6d8 Mega Necrotic',
    save: 'Dex',
    saveEffect: 'half on success',
  },
];

export const MEGA_SPELLS_BY_ID: Record<string, MegaSpellDef> = Object.fromEntries(
  MEGA_SPELLS.map((s) => [s.id, s]),
);

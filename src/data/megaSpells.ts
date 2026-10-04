// Mega spell reference: Dark Matter Sci-Fi 5E, printed pp. 401–404.
// Cast through the Gunner's Arcane Cannon action (p. 220).
// These are base-slot reminders; preparation, concentration and upcasting are manual.
export interface MegaSpellDef {
  id: string;
  name: string;
  level: number;
  school: string;
  description: string;
  damage: string;
  source: string;
  save?: 'Dex' | 'Con' | 'Wis' | 'Str' | 'Int' | 'Cha';
  saveEffect?: string;
}

export const MEGA_SPELLS: MegaSpellDef[] = [
  {
    "id": "conjure-asteroid",
    "name": "Conjure Asteroid",
    "level": 1,
    "school": "Conjuration",
    "description": "6,000 ft; concentration up to 1 hour. Creates an asteroid up to 1,500 ft in radius, AC 15 and 100 MHP; immune to Poison and Psychic. Each slot above 1 adds an asteroid.",
    "damage": "No direct damage",
    "source": "p. 402"
  },
  {
    "id": "disable-weapon",
    "name": "Disable Weapon",
    "level": 1,
    "school": "Enchantment",
    "description": "6,000 ft; concentration up to 1 minute. Disables one installed weapon. A later Magic action can change the affected weapon.",
    "damage": "No direct damage",
    "source": "p. 402",
    "save": "Wis",
    "saveEffect": "negates; repeat at end of each turn"
  },
  {
    "id": "recharge-shields",
    "name": "Recharge Shields",
    "level": 1,
    "school": "Abjuration",
    "description": "Self; instantaneous. Restores all of your ship’s Shield Points.",
    "damage": "No damage",
    "source": "p. 404"
  },
  {
    "id": "turbulence",
    "name": "Turbulence",
    "level": 1,
    "school": "Transmutation",
    "description": "6,000 ft; concentration up to 1 minute. Halves Speed and caps Maneuverability at 45 degrees.",
    "damage": "No damage",
    "source": "p. 404",
    "save": "Wis",
    "saveEffect": "negates"
  },
  {
    "id": "hack-system",
    "name": "Hack System",
    "level": 2,
    "school": "Enchantment",
    "description": "6,000 ft; concentration up to 10 minutes. Disables one system and prevents its repair while the spell lasts.",
    "damage": "No damage",
    "source": "p. 403",
    "save": "Wis",
    "saveEffect": "negates; repeat at end of each turn"
  },
  {
    "id": "local-jump",
    "name": "Local Jump",
    "level": 2,
    "school": "Conjuration",
    "description": "Self; instantaneous. Teleport the ship up to 3,000 feet in any direction and choose its facing.",
    "damage": "No damage",
    "source": "p. 404"
  },
  {
    "id": "meteoroid-shower",
    "name": "Meteoroid Shower",
    "level": 2,
    "school": "Conjuration",
    "description": "6,000 ft; concentration up to 1 minute. Creates a 2,000-foot Cube of Difficult Terrain. Save when the area appears, on entry, or at end of turn; at most once per turn.",
    "damage": "2d4 Mega Bludgeoning",
    "source": "p. 404",
    "save": "Dex",
    "saveEffect": "half on success"
  },
  {
    "id": "overcharge-weapon",
    "name": "Overcharge Weapon",
    "level": 2,
    "school": "Enchantment",
    "description": "Self; concentration up to 1 minute. One installed weapon deals the listed extra damage on every hit.",
    "damage": "1d6 Mega Force",
    "source": "p. 404"
  },
  {
    "id": "commandeer-ship",
    "name": "Commandeer Ship",
    "level": 3,
    "school": "Enchantment",
    "description": "6,000 ft; concentration up to 1 minute. Control a Fighter’s movement and attacks using your Reaction on its turn, while on the same plane. Higher slots permit Personal (5–6), Transport (7–8), or Corvette (9).",
    "damage": "No damage",
    "source": "p. 402",
    "save": "Wis",
    "saveEffect": "negates; repeat whenever damaged"
  },
  {
    "id": "phase-shift",
    "name": "Phase Shift",
    "level": 3,
    "school": "Transmutation",
    "description": "Self; concentration up to 1 minute. Reduce Bludgeoning, Piercing and Slashing damage from attacks by your spellcasting ability modifier. Pass through objects and creatures as Difficult Terrain; ending a turn inside one deals 1d10 Mega Force damage to your ship.",
    "damage": "No direct damage",
    "source": "p. 404"
  },
  {
    "id": "shield-burst",
    "name": "Shield Burst",
    "level": 3,
    "school": "Evocation",
    "description": "Self; concentration up to 1 minute. Requires current Shield Points. When your ship loses all its shields, a 3,000-foot Emanation damages Mega targets and the spell ends.",
    "damage": "5d8 Mega Lightning",
    "source": "p. 404",
    "save": "Dex",
    "saveEffect": "half on success"
  },
  {
    "id": "antimatter-mine",
    "name": "Antimatter Mine",
    "level": 4,
    "school": "Conjuration",
    "description": "6,000 ft; lasts until triggered or dispelled. Creates a mine (AC 15, 10 MHP; immune to Poison and Psychic). Detonates when destroyed, or a ship or Mega creature approaches within 1,000 ft or ends its turn there. Blast: 1,000-foot Emanation. Each slot above 4 adds one mine.",
    "damage": "4d12 Mega Necrotic",
    "source": "p. 402",
    "save": "Dex",
    "saveEffect": "half on success"
  },
  {
    "id": "eldritch-rift",
    "name": "Eldritch Rift",
    "level": 4,
    "school": "Conjuration",
    "description": "9,000 ft; concentration up to 1 minute. A 1,500-foot Sphere becomes Difficult Terrain. Failure also sets Speed to 0 until the spell ends or the target Dodges or uses Evasive Maneuvers. Save on creation, entry or end of turn, at most once per turn.",
    "damage": "3d6 Mega Bludgeoning",
    "source": "p. 403",
    "save": "Dex",
    "saveEffect": "no damage on success"
  },
  {
    "id": "shield-disruption",
    "name": "Shield Disruption",
    "level": 4,
    "school": "Abjuration",
    "description": "Self; concentration up to 1 minute. Ships in a 1,500-foot Emanation lose shields and cannot regain them until they leave.",
    "damage": "No damage",
    "source": "p. 404"
  },
  {
    "id": "dark-matter-override",
    "name": "Dark Matter Override",
    "level": 5,
    "school": "Transmutation",
    "description": "6,000 ft; concentration up to 1 hour. Target a Frigate or smaller ship with an engine capable of jumping. Failure sets Speed and Maneuverability to 0 until the end of its next turn; a second failed save then forces an immediate blind void jump.",
    "damage": "No damage",
    "source": "p. 402",
    "save": "Wis",
    "saveEffect": "negates; a second failure triggers the jump"
  },
  {
    "id": "hardlight-battleframe",
    "name": "Hardlight Battleframe",
    "level": 5,
    "school": "Conjuration",
    "description": "Self; concentration up to 1 minute. Summon the frame and teleport into its Pilot seat. Use the separate Hardlight Battleframe stat block, substituting the slot level. Requires an emerald ring worth 30+ CR and a plastic figurine. The Escape Pod persists for 1 hour after the spell ends.",
    "damage": "See summoned frame (p. 403)",
    "source": "p. 403"
  },
 ];

export const MEGA_SPELLS_BY_ID: Record<string, MegaSpellDef> = Object.fromEntries(
  MEGA_SPELLS.map((s) => [s.id, s]),
);

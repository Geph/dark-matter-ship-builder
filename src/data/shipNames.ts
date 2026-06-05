// ============================================================
// Random sci-fi ship name generator. Original word lists,
// combined into evocative starship designations.
// ============================================================

const PREFIXES = ['SSV', 'ISV', 'DMS', 'CSV', 'TSV', 'RSV', 'HMS', 'XV'];

const ADJECTIVES = [
  'Vagrant', 'Eternal', 'Silent', 'Crimson', 'Distant', 'Iron', 'Hollow',
  'Radiant', 'Wandering', 'Obsidian', 'Gilded', 'Fearless', 'Phantom',
  'Dauntless', 'Lonely', 'Burning', 'Frozen', 'Velvet', 'Savage', 'Quiet',
];

const NOUNS = [
  'Horizon', 'Vanguard', 'Specter', 'Nomad', 'Paragon', 'Comet', 'Reverie',
  'Lantern', 'Wayfarer', 'Tempest', 'Aurora', 'Sentinel', 'Drifter', 'Oracle',
  'Maelstrom', 'Requiem', 'Voyager', 'Pilgrim', 'Leviathan', 'Halcyon',
];

const SOLO = [
  'Dark Star', 'Event Horizon', 'Last Light', 'Void Runner', 'Star Chaser',
  'Null Point', 'Deep Black', 'Long Shot', 'Cold Comfort', 'Second Wind',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomShipName(): string {
  const roll = Math.random();
  if (roll < 0.25) {
    return `${pick(PREFIXES)} ${pick(SOLO)}`;
  }
  if (roll < 0.5) {
    return pick(SOLO);
  }
  const body = `${pick(ADJECTIVES)} ${pick(NOUNS)}`;
  return Math.random() < 0.6 ? `${pick(PREFIXES)} ${body}` : body;
}

import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ICONS_ROOT = path.join(__dirname, '../public/game-icons/icons/ffffff/000000/1x1');
const OUT = path.join(__dirname, '../public/game-icons/manifest.json');

const SHIP_KEYWORDS =
  /ship|rocket|space|shuttle|satellite|ufo|orbital|station|fighter|freighter|cruiser|transport|interceptor|scout|cargo|battleship|sailboat|sail|submarine|jet|aircraft|plane|boat|vessel|warp|thruster/i;

function labelFromName(name) {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const authors = await readdir(ICONS_ROOT, { withFileTypes: true });
const icons = [];

for (const authorDir of authors) {
  if (!authorDir.isDirectory()) continue;
  const author = authorDir.name;
  const files = await readdir(path.join(ICONS_ROOT, author));
  for (const file of files) {
    if (!file.endsWith('.svg')) continue;
    const name = file.slice(0, -4);
    icons.push({
      id: `${author}/${name}`,
      author,
      name,
      label: labelFromName(name),
      featured: SHIP_KEYWORDS.test(name),
    });
  }
}

icons.sort((a, b) => a.label.localeCompare(b.label));

const manifest = {
  basePath: '/game-icons/icons/ffffff/000000/1x1',
  credit: 'https://game-icons.net/',
  license: 'CC BY 3.0',
  icons,
  featuredIds: icons.filter((i) => i.featured).map((i) => i.id),
};

await writeFile(OUT, JSON.stringify(manifest));
console.log(`Wrote ${icons.length} icons (${manifest.featuredIds.length} featured) to manifest.json`);

import { readFileSync, writeFileSync } from 'node:fs';

const pkgPath = 'package.json';
const readmePath = 'README.md';

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const [major = 0, minor = 0] = pkg.version.split('.').map(Number);
const deployedLabel = `v${major}.${minor}`;
const next = `${major}.${minor + 1}.0`;

pkg.version = next;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`Version bumped to ${next}`);

let readme = readFileSync(readmePath, 'utf8');
const date = new Date().toISOString().slice(0, 10);

readme = readme.replace(
  /\*\*Current release:\*\* v[\d.]+/,
  `**Current release:** ${deployedLabel}`,
);

const changelogMarker = '### Changelog\n';
const entry = `- **${deployedLabel}** — Deployed ${date}\n`;
if (!readme.includes(entry.trim())) {
  readme = readme.replace(changelogMarker, `${changelogMarker}\n${entry}`);
}

writeFileSync(readmePath, readme);
console.log(`README updated for ${deployedLabel}`);

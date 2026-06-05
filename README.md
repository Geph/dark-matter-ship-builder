# Dark Matter // Ship Builder

A fan-made web app for building starships under the **Dark Matter Sci-Fi 5E**
ship-creation rules (Mage Hand Press, pp. 206–220). It walks your party through
the official four-step flow, enforces Credits and slot limits automatically, and
renders a finished stat block you can print, copy, or share.

The UI is styled as a starship terminal: dark panels, cyan glow, scanlines, and
a **top-down hull schematic** where weapons mount into facing arcs — inspired by
tabletop fighter record sheets.

## What it does

### Ship creation wizard

| Step | Name | What you do |
|------|------|-------------|
| 1 | **Crew Manifest** | Set party level (1–20) and player count. Pick crew roles; each role auto-installs its system for free (Pilot → Pilot's Seat, Gunner → Gunner Bay, etc.). |
| 2 | **Hull Scan** | Roll d100 or pick from the four official flavor tables: appearance, condition, interior, and unique trait. Override any result with custom text. |
| 3 | **Loadout** | Spend Credits on systems, weapons, upgrades, and Dark Matter engine class upgrades. Live budget and slot bars warn when you're over limits. |
| 4 | **Designation** | Name the ship, christen it into the registry, and review the final stat block. Export via print/PDF, plain-text copy, or share link. |

### Ship configuration visual

The **Ship Configuration** panel shows a top-down hull with five weapon-mount
arcs:

- **Fore** · **Port** · **Starboard** · **Aft** · **Turret**

Select an arc, then mount a weapon from the Loadout tab — it appears on the
diagram with an unmount control. A **hardpoint slot pip grid** fills as you
install systems and weapons (upgrades cost 0 slots).

### Rules enforcement

The app enforces the rulebook automatically:

- Credits budget: `(1,000 + 150 × (level − 1)) × players`
- Systems and weapons cost **1 slot** each; upgrades cost **0**
- Size prerequisites (e.g. Fighter Bay requires Transport+)
- Dark Matter class prerequisites (Dead Reckoner, Hypercapacitor, Panic Drive)
- Repeat caps (Fighter Bay by size, Pilot's Seat ≤ 2, Teleporters ≤ 2 on Frigate+)
- Every ship needs at least one **Pilot's Seat** or **Fighter Bay**
- Crew-role and starting systems are **free** (Escape Pods, Life Support, Sensors, Shield Generator, plus role grants)

### Persistence

Ships save to your browser's **localStorage** — no account or server required.
Use **My Ships** to edit, duplicate, delete, or open a read-only share view at
`/ship/:shareToken`.

> Share links work on the same browser/device where the ship was saved. For
> cross-device sharing, swap `src/lib/storage.ts` for a backend (Supabase steps
> below).

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/build` | New ship wizard |
| `/build/:id` | Edit a saved ship |
| `/ships` | My Ships dashboard |
| `/ship/:token` | Read-only stat block + hull schematic |

## Quick start

**Requirements:** Node.js 18+ and npm.

```bash
git clone git@github.com:Geph/dark-matter-ship-builder.git
cd dark-matter-ship-builder
npm install
npm run dev
```

Open **http://localhost:5173** and click **Build a Ship**.

### Production build

```bash
npm run build    # type-check + output to dist/
npm run preview  # serve the production build locally
```

## Project structure

```
src/
  data/              # Rulebook tables (hardcoded for easy auditing)
    shipStats.ts         # Stats by level, sizes, shield points by size
    systems.ts           # Ship systems, costs, prerequisites
    weapons.ts           # Ranged + melee weapons
    upgrades.ts          # Upgrades + DM engine upgrade costs
    crewRoles.ts         # Crew roles → granted systems
    flavorTables.ts      # Four d100 description tables
    shipNames.ts         # Random name generator
  lib/
    types.ts             # Domain types (Ship, WeaponFacing, etc.)
    rules.ts             # All game logic — budget, slots, validation, mutators
    storage.ts           # Persistence (localStorage; swap for backend here)
    exportText.ts        # Plain-text stat block export
  components/
    ShipDiagram.tsx      # Visual hull + facing arcs + slot pips
    StatBlock.tsx        # Formatted stat card
    builder/             # Wizard steps, HUD, progress bar
  pages/                 # Landing, Builder, MyShips, PublicShip
```

Game math lives in `src/lib/rules.ts`; all rulebook numbers live in
`src/data/*`. Update tables there without touching UI code.

## Deployment

The app is a static SPA. Build and deploy `dist/` to **Vercel**, **Netlify**,
**Render Static**, or **GitHub Pages**.

For client-side routing, add a SPA fallback to `index.html`. On Vercel:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

## Optional: Supabase backend

To persist ships across devices and enable real share links:

1. Create a `ships` table matching `Ship` in `src/lib/types.ts`.
2. `npm install @supabase/supabase-js`
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` (git-ignored).
4. Reimplement `listShips`, `getShip`, `saveShip`, etc. in `src/lib/storage.ts`
   against Supabase; make them `async` and await them in pages.
5. Optionally add Supabase Auth and require login to save (building stays open).

## Tech stack

- React 19 + React Router 7
- Vite 8 + TypeScript
- Tailwind CSS 4

## Credits

Game content © Mage Hand Press, *Dark Matter Sci-Fi 5E*. This is a fan-made
tool and is not affiliated with or endorsed by the publisher.

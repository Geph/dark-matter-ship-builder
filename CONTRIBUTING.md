# Contributing to Dark Matter Ship Builder

Thank you for helping improve this fan-made ship builder. This guide covers
local setup, where code lives, and what we expect in pull requests.

## Getting started

Requirements: Node.js 18+ and npm.

```bash
git clone https://github.com/Geph/dark-matter-ship-builder.git
cd dark-matter-ship-builder
npm install
npm run dev
```

Open **http://localhost:5173** and click **Build a Ship**. See the
[README](README.md) **Quick start** section for production build and GitHub
Pages notes.

Optional Supabase variables are documented in [`.env.example`](.env.example).

## Before opening a pull request

Run these from the repo root:

```bash
npm run lint
npm run build
```

- **`npm run lint`** — ESLint (`eslint.config.js`).
- **`npm run build`** — regenerates the game-icons manifest, runs TypeScript
  (`tsc -b`), and produces a production Vite build. There is no separate
  typecheck script; the build step is the typecheck.

There is no automated test suite yet. Describe what you tested manually in your
PR (e.g. builder step, ship sheet, My Ships, print flow).

## Branch naming

Use a short prefix and a descriptive slug:

- `feature/*` — new capability or UI
- `fix/*` — bug fixes
- `chore/*` — tooling, docs, CI, dependencies

Example: `feature/fighter-bay-export`, `fix/slot-count-display`.

## Pull request expectations

- **Small and focused** — one logical change per PR when possible.
- **Link an issue** if one exists (`Fixes #123` or `Relates to #456`).
- **Describe manual testing** — what you clicked through and on which browser.
- **Update the README** if user-facing behavior or setup changes.
- **Do not bump the release version** — see below.

`main` is protected: changes merge via PR and must pass CI.

## Release versioning (maintainers only)

Contributors should **not**:

- run `npm run version:bump`
- hand-edit **Current release** in `README.md`
- change the `version` field in `package.json` for release bookkeeping

Version bumps happen **after** work is merged to `main`, by maintainers, as
documented in the README section
[Updating the release version](README.md#updating-the-release-version).

## Where changes belong

Use the README [Project structure](README.md#project-structure) as the map:

| Area | Path | Purpose |
|------|------|---------|
| Game math & validation | `src/lib/rules.ts` | Budget, slots, validation, fighter bay sync |
| Rulebook data | `src/data/*` | Fighters, weapons, crew actions, tables, manifests |
| UI components | `src/components/*` | Reusable UI (diagram, stat block, builder steps, …) |
| Pages / routes | `src/pages/*` | Landing, Builder, My Ships, Public ship sheet |
| Persistence & sharing | `src/lib/storage.ts`, `src/lib/sharing.ts` | localStorage (or future backend) |
| Public assets | `public/game-icons/` | game-icons.net SVG pack |

Put rulebook numbers and tables in `src/data/*`; put calculations and
enforcement in `src/lib/rules.ts`; keep presentation in components and pages.

### Game content / rules accuracy

Changes that affect *Dark Matter Sci-Fi 5E* rules accuracy (stats, costs,
prerequisites, crew actions, etc.) should **cite the rulebook page** in the PR
description, consistent with how the README references ship creation on
**pp. 206–220**. If you adjust data, say which table or section you matched.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be
respectful in issues and reviews.

## Questions

Open a [GitHub issue](https://github.com/Geph/dark-matter-ship-builder/issues)
for bugs, feature ideas, or questions. Use the issue templates when they fit.

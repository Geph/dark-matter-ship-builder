import { useMemo, useState } from 'react';
import type { Ship, WeaponFacing } from '../../lib/types';
import { SYSTEMS } from '../../data/systems';
import { UPGRADES } from '../../data/upgrades';
import { RANGED_WEAPONS, MELEE_WEAPONS, type WeaponDef } from '../../data/weapons';
import { DM_ENGINE_COSTS } from '../../data/upgrades';
import { statsForLevel } from '../../data/shipStats';
import InfoTooltip from '../InfoTooltip';
import { listShips } from '../../lib/storage';
import {
  effectiveBudget,
  computeCreditsSpent,
  slotsRemaining,
  lockedInstalls,
  maxInstallsForSystem,
  canInstallSystem,
  canInstallUpgrade,
  installSystem,
  removeSystem,
  addWeapon,
  addFighterWeapon,
  setFighterBayType,
  setFighterBayCatalogId,
  setFighterBayFromCustomShip,
  syncFighterBays,
  effectiveDmClass,
  dmEngineUpgradeCost,
  weaponHasFixed,
  canMountWeapon,
  resolveMountFacing,
  isHullEmbeddedSystem,
} from '../../lib/rules';
import { FIGHTER_CATALOG, resolveFighterBayHull } from '../../data/fighters';

interface Props {
  ship: Ship;
  update: (mutator: (s: Ship) => Ship) => void;
  selectedFacing: WeaponFacing;
  configTarget: 'mothership' | number;
}

type Tab = 'systems' | 'weapons' | 'upgrades' | 'engine';

const TABS: { id: Tab; label: string }[] = [
  { id: 'systems', label: 'SYSTEMS' },
  { id: 'weapons', label: 'WEAPONS' },
  { id: 'upgrades', label: 'UPGRADES' },
  { id: 'engine', label: 'DM ENGINE' },
];

export default function StepBuild({ ship, update, selectedFacing, configTarget }: Props) {
  const [tab, setTab] = useState<Tab>('systems');

  const budget = effectiveBudget(ship);
  const remaining = budget - computeCreditsSpent(ship);
  const freeSlots = slotsRemaining(ship);

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-xl text-cyan glow-text tracking-wider">
          STEP 3 · LOADOUT
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {ship.isFighterBuild
            ? 'Fighter hulls have 6 slots. Install any system without a Personal-size minimum — Shield Generator, Pilot\'s Seat, Life Support, Sensors, and Escape Pod (Fighter) are all valid. Weapons and most upgrades have no size limit.'
            : 'Spend Credits on systems, weapons, and upgrades. Hull-embedded systems are pre-installed in the body. Only weapons use mount points — Fixed on arc facings, others on the Turret.'}{' '}
          Hover the <span className="text-amber">i</span> icon for details.
        </p>
      </header>

      <div className="flex gap-1 flex-wrap">
        {TABS.filter((t) => !(ship.isFighterBuild && t.id === 'engine')).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`font-display text-[11px] tracking-widest px-3 py-2 rounded-sm border transition-all ${
              tab === t.id
                ? 'border-cyan text-cyan bg-cyan/10 shadow-[0_0_12px_#00e5ff55]'
                : 'border-slate-700 text-slate-400 hover:text-cyan hover:border-cyan/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'systems' && (
        <SystemsTab ship={ship} update={update} remaining={remaining} freeSlots={freeSlots} />
      )}
      {tab === 'weapons' && (
        <WeaponsTab
          ship={ship}
          update={update}
          remaining={remaining}
          freeSlots={freeSlots}
          selectedFacing={selectedFacing}
          configTarget={configTarget}
        />
      )}
      {tab === 'upgrades' && (
        <UpgradesTab ship={ship} update={update} remaining={remaining} />
      )}
      {tab === 'engine' && <EngineTab ship={ship} update={update} remaining={remaining} />}
    </div>
  );
}

function CostTag({ cost, free }: { cost: number; free?: boolean }) {
  if (free) return <span className="font-mono-hud text-ok text-xs">FREE</span>;
  return <span className="font-mono-hud text-amber text-xs">{cost.toLocaleString()} CR</span>;
}

// ---------------- Systems ----------------
function SystemsTab({
  ship,
  update,
  remaining,
  freeSlots,
}: {
  ship: Ship;
  update: Props['update'];
  remaining: number;
  freeSlots: number;
}) {
  const autoNonRepeatable = useMemo(() => {
    const out: typeof SYSTEMS = [];
    for (const def of SYSTEMS) {
      const locked = lockedInstalls(ship, def.id);
      if (locked <= 0) continue; // not automatically included
      if ((ship.systems[def.id] ?? 0) !== locked) continue; // must match exactly the free amount
      const max = maxInstallsForSystem(def, ship.size);
      if (max <= 1) out.push(def);
    }
    return out;
  }, [ship]);

  const autoSet = new Set(autoNonRepeatable.map((d) => d.id));

  return (
    <div className="space-y-3">
      {autoNonRepeatable.length > 0 && (
        <div className="panel p-3 border-slate-700/60">
          <p className="font-display text-[11px] tracking-[0.25em] text-amber mb-2">
            AUTO-INCLUDED (NON-REPEATABLE)
          </p>
          <div className="flex flex-wrap gap-2">
            {autoNonRepeatable.map((def) => (
              <div
                key={def.id}
                className="panel p-2 bg-void/30 border-slate-700/60 rounded-sm"
              >
                <div className="font-display text-[11px] text-cyan">
                  {def.name}
                </div>
                <div className="font-mono-hud text-[10px] text-amber mt-1">
                  Replace {def.cost.toLocaleString()} CR
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {SYSTEMS.map((def) => {
          if (autoSet.has(def.id)) return null;
        const count = ship.systems[def.id] ?? 0;
        const locked = lockedInstalls(ship, def.id);
        const prereq = canInstallSystem(ship, def);
        const nextIsFree = count < locked;
        const nextCost = nextIsFree ? 0 : def.cost;
        const noBudget = nextCost > remaining;
        const noSlots = freeSlots <= 0;
        const blockedReason = !prereq.ok
          ? prereq.reason
          : noSlots
            ? 'No free slots — remove a component first.'
            : noBudget
              ? 'Not enough Credits.'
              : undefined;

        return (
          <div
            key={def.id}
            className={`panel p-3 ${count > 0 ? 'border-cyan/60' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm text-cyan">{def.name}</span>
                  <InfoTooltip text={def.description} />
                  {isHullEmbeddedSystem(def.id) && (
                    <span className="font-mono-hud text-[9px] text-ok border border-ok/40 px-1 rounded">
                      IN HULL
                    </span>
                  )}
                  {count > 0 && (
                    <span className="font-mono-hud text-[10px] text-ok border border-ok/50 rounded px-1">
                      ×{count}
                    </span>
                  )}
                </div>
                <div className="mt-0.5">
                  <CostTag cost={def.cost} />
                  {def.minSize && (
                    <span className="font-mono-hud text-[10px] text-slate-500 ml-2">
                      {def.minSize}+
                    </span>
                  )}
                </div>
                {def.note && (
                  <p className="text-slate-500 text-[11px] mt-1">{def.note}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="btn btn-danger !px-2 !py-0.5"
                    disabled={count <= locked}
                    title={count <= locked ? 'Granted free by crew/role — cannot remove.' : 'Uninstall'}
                    onClick={() => update((s) => removeSystem(s, def.id))}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="btn btn-solid !px-2 !py-0.5"
                    disabled={!!blockedReason}
                    title={blockedReason}
                    onClick={() => update((s) => installSystem(s, def.id))}
                  >
                    +
                  </button>
                </div>
                {nextIsFree && (
                  <span className="font-mono-hud text-[9px] text-ok">next is free</span>
                )}
              </div>
            </div>
            {blockedReason && count === 0 && (
              <p className="text-danger/80 font-mono-hud text-[10px] mt-1">{blockedReason}</p>
            )}

            {def.id === 'fighter-bay' && count > 0 && !ship.isFighterBuild && (
              <FighterBayAssignments ship={ship} update={update} bayCount={count} />
            )}
          </div>
        );
        })}
      </div>
    </div>
  );
}

function FighterBayAssignments({
  ship,
  update,
  bayCount,
}: {
  ship: Ship;
  update: Props['update'];
  bayCount: number;
}) {
  const bays = syncFighterBays(ship);
  const savedFighters = useMemo(
    () => listShips().filter((s) => s.isFighterBuild),
    [],
  );
  const savedById = useMemo(
    () => new Map(savedFighters.map((f) => [f.id, f])),
    [savedFighters],
  );

  return (
    <div className="mt-3 pt-2 border-t border-slate-700/60 space-y-2">
      <p className="font-mono-hud text-[10px] text-slate-400">Deployed fighters (per bay):</p>
      {Array.from({ length: bayCount }, (_, i) => {
        const bay = bays[i];
        const mode =
          bay?.type === 'none' ? 'none' : bay?.customShipId ? 'custom' : 'prebuilt';
        const hull = bay?.type === 'none' ? null : resolveFighterBayHull(bay);
        const customShip = bay?.customShipId
          ? savedById.get(bay.customShipId) ?? null
          : null;
        return (
          <div key={i} className="flex flex-col gap-1">
            <label className="font-mono-hud text-[10px] text-slate-500">
              Bay {i + 1}
            </label>
            <select
              value={mode}
              onChange={(e) => {
                const next = e.target.value;
                if (next === 'none') {
                  update((s) => setFighterBayType(s, i, 'none'));
                  return;
                }
                if (next === 'prebuilt') {
                  update((s) =>
                    setFighterBayCatalogId(s, i, bay?.catalogId ?? 'sabre'),
                  );
                  return;
                }
                const first = savedFighters[0];
                if (first) update((s) => setFighterBayFromCustomShip(s, i, first));
              }}
              className="w-full bg-void border border-cyan/40 rounded-sm px-2 py-1 font-mono-hud text-xs text-cyan"
            >
              <option value="none">None</option>
              <option value="prebuilt">Pre-built fighter</option>
              <option value="custom">Customized fighter</option>
            </select>

            {mode === 'prebuilt' && (
              <select
                value={bay?.catalogId ?? 'sabre'}
                onChange={(e) =>
                  update((s) => setFighterBayCatalogId(s, i, e.target.value))
                }
                className="w-full bg-void border border-amber/40 rounded-sm px-2 py-1 font-mono-hud text-xs text-amber"
              >
                {FIGHTER_CATALOG.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.subtitle}
                  </option>
                ))}
              </select>
            )}

            {mode === 'custom' && (
              <select
                value={bay?.customShipId ?? ''}
                onChange={(e) => {
                  const next = savedById.get(e.target.value);
                  if (next) update((s) => setFighterBayFromCustomShip(s, i, next));
                }}
                className="w-full bg-void border border-amber/40 rounded-sm px-2 py-1 font-mono-hud text-xs text-amber"
                disabled={savedFighters.length === 0}
                title={savedFighters.length === 0 ? 'Create a customized fighter first.' : undefined}
              >
                {savedFighters.length === 0 ? (
                  <option value="">No customized fighters saved</option>
                ) : (
                  <>
                    {savedFighters.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name || 'Untitled fighter'} ({f.fighterHullId ?? 'unknown'})
                      </option>
                    ))}
                  </>
                )}
              </select>
            )}

            {mode === 'prebuilt' && hull && (
              <p className="font-mono-hud text-[9px] text-slate-500">
                {hull.subtitle} · {hull.cost.toLocaleString()} CR · AC {hull.ac} MHP {hull.mhp}
              </p>
            )}

            {mode === 'custom' && customShip && (
              <p className="font-mono-hud text-[9px] text-slate-500">
                Custom build · {customShip.fighterHullId ?? 'unknown'} · weapons: {customShip.weapons.length}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------- Weapons ----------------
function WeaponsTab({
  ship,
  update,
  remaining,
  freeSlots,
  selectedFacing,
  configTarget,
}: {
  ship: Ship;
  update: Props['update'];
  remaining: number;
  freeSlots: number;
  selectedFacing: WeaponFacing;
  configTarget: 'mothership' | number;
}) {
  const mountingFighter = configTarget !== 'mothership';
  const fighterBay = mountingFighter ? syncFighterBays(ship)[configTarget] : null;
  const fighterBlocked = mountingFighter && (!fighterBay || fighterBay.type === 'none');
  const renderGroup = (title: string, weapons: WeaponDef[]) => (
    <div>
      <h3 className="font-display text-xs tracking-widest text-amber mb-2">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {weapons.map((w) => {
          const fixed = weaponHasFixed(w);
          const mountFacing = resolveMountFacing(w, selectedFacing);
          const mountCheck = canMountWeapon(w, mountFacing);
          const noBudget = w.cost > remaining;
          const noSlots = !mountingFighter && freeSlots <= 0;
          const mountBlocked = !mountCheck.ok;
          const blocked = fighterBlocked || noSlots || noBudget || mountBlocked;
          const reason = fighterBlocked
            ? 'Select a fighter on the Fighter Bay loadout item first.'
            : mountBlocked
              ? mountCheck.reason
              : noSlots
                ? 'No free slots.'
                : noBudget
                  ? 'Not enough Credits.'
                  : undefined;
          const mountLabel = fixed ? `Mount ▸ ${selectedFacing}` : 'Mount ▸ Turret (auto)';

          return (
            <div key={w.id} className="panel p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-display text-sm text-cyan">{w.name}</span>
                    <InfoTooltip text={w.description} />
                    {fixed && (
                      <span className="font-mono-hud text-[9px] text-amber border border-amber/40 px-1 rounded">
                        FIXED
                      </span>
                    )}
                  </div>
                  <div className="font-mono-hud text-[11px] text-slate-200">{w.damage}</div>
                  <div className="font-mono-hud text-[10px] text-slate-500 mt-0.5">
                    {w.type} · Mastery: {w.mastery}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <CostTag cost={w.cost} />
                  <button
                    type="button"
                    className="btn btn-solid !px-2 !py-0.5"
                    disabled={blocked}
                    title={reason ?? mountLabel}
                    onClick={() =>
                      update((s) =>
                        mountingFighter
                          ? addFighterWeapon(s, configTarget as number, w.name, selectedFacing)
                          : addWeapon(s, w.name, selectedFacing),
                      )
                    }
                  >
                    {mountLabel}
                  </button>
                </div>
              </div>
              <p className="text-slate-500 text-[10px] mt-1 font-mono-hud">{w.properties}</p>
              {fixed && selectedFacing === 'Turret' && (
                <p className="text-danger/80 font-mono-hud text-[10px] mt-1">
                  Select Fore, Port, Starboard, or Aft on the configuration panel.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="panel p-2 font-mono-hud text-[11px] text-slate-300 flex flex-wrap items-center gap-2">
        <span className="text-amber">TARGET:</span>
        <span className={mountingFighter ? 'text-amber glow-amber' : 'text-cyan glow-text'}>
          {mountingFighter ? `Fighter ${(configTarget as number) + 1}` : 'Mothership'}
        </span>
        <span className="text-slate-500">·</span>
        <span className="text-amber">ARC:</span>
        <span className="text-cyan glow-text">{selectedFacing}</span>
        <span className="text-slate-500">
          — Fixed weapons use this arc; non-fixed auto-mount on Turret
        </span>
      </div>
      {renderGroup('RANGED', RANGED_WEAPONS)}
      {renderGroup('MELEE', MELEE_WEAPONS)}
    </div>
  );
}

// ---------------- Upgrades ----------------
function UpgradesTab({
  ship,
  update,
  remaining,
}: {
  ship: Ship;
  update: Props['update'];
  remaining: number;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {UPGRADES.map((def) => {
        const installed = ship.upgrades.includes(def.id);
        const prereq = canInstallUpgrade(ship, def);
        const noBudget = def.cost > remaining;
        const blockedReason = installed
          ? undefined
          : !prereq.ok
            ? prereq.reason
            : noBudget
              ? 'Not enough Credits.'
              : undefined;
        return (
          <button
            key={def.id}
            type="button"
            disabled={!installed && !!blockedReason}
            title={blockedReason}
            onClick={() =>
              update((s) =>
                installed
                  ? { ...s, upgrades: s.upgrades.filter((u) => u !== def.id) }
                  : { ...s, upgrades: [...s.upgrades, def.id] },
              )
            }
            className={`text-left panel p-3 transition-all ${
              installed ? 'border-cyan! shadow-[0_0_14px_#00e5ff55]' : 'hover:border-cyan/60'
            } ${!installed && blockedReason ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-1">
              <span className="font-display text-sm text-cyan">{def.name}</span>
              <InfoTooltip text={def.description} />
              {installed && <span className="text-ok text-xs ml-auto">✓</span>}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <CostTag cost={def.cost} />
              {def.minSize && (
                <span className="font-mono-hud text-[10px] text-slate-500">{def.minSize}+</span>
              )}
              {def.minDmClass != null && (
                <span className="font-mono-hud text-[10px] text-slate-500">
                  DM {def.minDmClass}+
                </span>
              )}
            </div>
            {!installed && blockedReason && (
              <p className="text-danger/80 font-mono-hud text-[10px] mt-1">{blockedReason}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------- Dark Matter Engine ----------------
function EngineTab({
  ship,
  update,
  remaining,
}: {
  ship: Ship;
  update: Props['update'];
  remaining: number;
}) {
  const baseClass = statsForLevel(ship.level).dmClass;
  const current = effectiveDmClass(ship);
  const currentUpgradeCost = dmEngineUpgradeCost(ship);

  const setClass = (target: number) => {
    update((s) => ({
      ...s,
      upgradedDmClass: target <= baseClass ? null : target,
    }));
  };

  // Cost to go from current effective class to the next one.
  const nextClass = current + 1;
  const nextStepCost = DM_ENGINE_COSTS[nextClass] ?? null;
  const canUpgrade = nextClass <= 9 && nextStepCost != null && nextStepCost <= remaining;

  return (
    <div className="panel p-4 space-y-4">
      <p className="text-slate-400 text-sm">
        Your hull's base Dark Matter Engine is <span className="text-cyan">Class {baseClass}</span>{' '}
        (set by level). Upgrading raises jump capability — each class is purchased in
        sequence per the engine table.
      </p>

      <div className="flex items-center justify-between panel p-3">
        <div>
          <div className="font-display text-[11px] tracking-widest text-slate-300">
            CURRENT CLASS
          </div>
          <div className="font-mono-hud text-3xl text-cyan glow-text">{current}</div>
          {currentUpgradeCost > 0 && (
            <div className="font-mono-hud text-[10px] text-amber">
              upgrade spent: {currentUpgradeCost.toLocaleString()} CR
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-danger !px-3"
            disabled={current <= baseClass}
            onClick={() => setClass(current - 1)}
          >
            −
          </button>
          <button
            type="button"
            className="btn btn-solid !px-3"
            disabled={!canUpgrade}
            title={
              nextClass > 9
                ? 'Maximum class reached.'
                : !canUpgrade
                  ? 'Not enough Credits.'
                  : `Upgrade to Class ${nextClass}`
            }
            onClick={() => setClass(nextClass)}
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {Object.entries(DM_ENGINE_COSTS).map(([cls, cost]) => {
          const c = Number(cls);
          const reached = current >= c;
          const isBase = c <= baseClass;
          return (
            <div
              key={cls}
              className={`text-center rounded-sm border p-2 ${
                reached ? 'border-cyan bg-cyan/10' : 'border-slate-700'
              }`}
            >
              <div className={`font-display text-sm ${reached ? 'text-cyan' : 'text-slate-400'}`}>
                CL {cls}
              </div>
              <div className="font-mono-hud text-[10px] text-amber">
                {isBase ? 'base' : `${cost.toLocaleString()}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { Ship, WeaponFacing } from '../../lib/types';
import { SYSTEMS } from '../../data/systems';
import { UPGRADES } from '../../data/upgrades';
import { RANGED_WEAPONS, MELEE_WEAPONS, type WeaponDef } from '../../data/weapons';
import { DM_ENGINE_COSTS } from '../../data/upgrades';
import { statsForLevel } from '../../data/shipStats';
import {
  budgetForLevel,
  computeCreditsSpent,
  slotsRemaining,
  lockedInstalls,
  canInstallSystem,
  canInstallUpgrade,
  installSystem,
  removeSystem,
  addWeapon,
  effectiveDmClass,
  dmEngineUpgradeCost,
} from '../../lib/rules';

interface Props {
  ship: Ship;
  update: (mutator: (s: Ship) => Ship) => void;
  selectedFacing: WeaponFacing;
}

type Tab = 'systems' | 'weapons' | 'upgrades' | 'engine';

const TABS: { id: Tab; label: string }[] = [
  { id: 'systems', label: 'SYSTEMS' },
  { id: 'weapons', label: 'WEAPONS' },
  { id: 'upgrades', label: 'UPGRADES' },
  { id: 'engine', label: 'DM ENGINE' },
];

export default function StepBuild({ ship, update, selectedFacing }: Props) {
  const [tab, setTab] = useState<Tab>('systems');

  const budget = budgetForLevel(ship.level, ship.players);
  const remaining = budget - computeCreditsSpent(ship);
  const freeSlots = slotsRemaining(ship);

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-xl text-cyan glow-text tracking-wider">
          STEP 3 · LOADOUT
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Spend Credits on systems, weapons, and upgrades. Systems and weapons cost
          1 slot each; upgrades are free of slots. Select a facing arc on the
          configuration panel before mounting weapons.
        </p>
      </header>

      <div className="flex gap-1 flex-wrap">
        {TABS.map((t) => (
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
          update={update}
          remaining={remaining}
          freeSlots={freeSlots}
          selectedFacing={selectedFacing}
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
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {SYSTEMS.map((def) => {
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
          </div>
        );
      })}
    </div>
  );
}

// ---------------- Weapons ----------------
function WeaponsTab({
  update,
  remaining,
  freeSlots,
  selectedFacing,
}: {
  update: Props['update'];
  remaining: number;
  freeSlots: number;
  selectedFacing: WeaponFacing;
}) {
  const renderGroup = (title: string, weapons: WeaponDef[]) => (
    <div>
      <h3 className="font-display text-xs tracking-widest text-amber mb-2">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {weapons.map((w) => {
          const noBudget = w.cost > remaining;
          const noSlots = freeSlots <= 0;
          const blocked = noSlots || noBudget;
          const reason = noSlots
            ? 'No free slots.'
            : noBudget
              ? 'Not enough Credits.'
              : undefined;
          return (
            <div key={w.id} className="panel p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-sm text-cyan">{w.name}</div>
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
                    title={reason ?? `Mount on ${selectedFacing}`}
                    onClick={() => update((s) => addWeapon(s, w.name, selectedFacing))}
                  >
                    Mount ▸ {selectedFacing}
                  </button>
                </div>
              </div>
              <p className="text-slate-500 text-[10px] mt-1 font-mono-hud">{w.properties}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="panel p-2 font-mono-hud text-[11px] text-slate-300 flex items-center gap-2">
        <span className="text-amber">ACTIVE MOUNT ARC:</span>
        <span className="text-cyan glow-text">{selectedFacing}</span>
        <span className="text-slate-500">— change it on the configuration panel ▸</span>
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
            <div className="flex items-center justify-between">
              <span className="font-display text-sm text-cyan">{def.name}</span>
              {installed && <span className="text-ok text-xs">✓</span>}
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

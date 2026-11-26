import ShipHullSchematic from './ShipHullSchematic';
import type { FighterBaySlot, Ship, ShipSize, WeaponFacing } from '../lib/types';
import { WEAPONS_BY_NAME } from '../data/weapons';
import {
  FIGHTER_SLOT_COUNT,
  fighterDisplayName,
  resolveFighterBayHull,
} from '../data/fighters';
import {
  effectiveDmClass,
  fighterSlotsUsed,
  fighterBayMhp,
  fighterBayShieldPoints,
  fighterWeaponsByFacing,
  slotsUsed,
  weaponsByFacing,
} from '../lib/rules';

// ============================================================
// Ship Configuration visual area.
// ============================================================

interface FacingNode {
  facing: WeaponFacing;
  label: string;
}

const SIDE_NODES: FacingNode[] = [
  { facing: 'Port', label: 'PORT' },
  { facing: 'Starboard', label: 'STBD' },
];

interface Props {
  ship: Ship;
  fighterBay?: FighterBaySlot;
  fighterBayIndex?: number;
  selectedFacing?: WeaponFacing;
  onSelectFacing?: (f: WeaponFacing) => void;
  onRemoveWeapon?: (index: number) => void;
  /** Mothership + deployed fighter switcher below hardpoint slots. */
  fighterBayTargets?: {
    bays: FighterBaySlot[];
    active: 'mothership' | number;
    onSelect: (target: 'mothership' | number) => void;
  };
}

export default function ShipDiagram({
  ship,
  fighterBay,
  fighterBayIndex,
  selectedFacing,
  onSelectFacing,
  onRemoveWeapon,
  fighterBayTargets,
}: Props) {
  const interactive = !!onSelectFacing;
  const isBayFighter = !!fighterBay;
  const isFighterHull = ship.isFighterBuild || isBayFighter;
  const hull = fighterBay ? resolveFighterBayHull(fighterBay) : null;
  const byFacing = isBayFighter
    ? fighterWeaponsByFacing(fighterBay!.weapons)
    : weaponsByFacing(ship);
  const used = isBayFighter ? fighterSlotsUsed(fighterBay!) : slotsUsed(ship);
  const totalSlots = isBayFighter ? (hull?.slots ?? FIGHTER_SLOT_COUNT) : ship.totalSlots;
  const dm = effectiveDmClass(ship);
  const pips = Array.from({ length: totalSlots }, (_, i) => i < used);

  const displaySize: ShipSize = isFighterHull ? 'Fighter' : ship.size;
  const displayMhp = isBayFighter ? fighterBayMhp(fighterBay!) : ship.mhp;
  const hullNow = isBayFighter ? displayMhp : ship.mhpCurrent ?? displayMhp;
  const shieldMax = isBayFighter ? fighterBayShieldPoints(fighterBay!) : ship.shieldPoints;
  const shieldNow = isBayFighter ? shieldMax : ship.shieldCurrent ?? shieldMax;
  const displayAc = isBayFighter ? (hull?.ac ?? '—') : ship.ac;
  const displaySpeed = isBayFighter ? (hull?.speed ?? 0) : ship.speed;
  const displayManeuver = isBayFighter ? (hull?.maneuverability ?? '—') : ship.maneuverability;
  const configTitle = isBayFighter
    ? `FIGHTER ${fighterBayIndex ?? ''} · ${fighterDisplayName(fighterBay!).toUpperCase()}`
    : ship.isFighterBuild
      ? `FIGHTER · ${(ship.fighterHullId ?? 'custom').replace(/-/g, ' ').toUpperCase()}`
      : 'SHIP CONFIGURATION';

  const renderMount = (node: FacingNode, className = '') => {
    const mounted = byFacing[node.facing];
    const active = selectedFacing === node.facing;
    const empty = mounted.length === 0;
    return (
      <div className={className}>
        <MountButton
          node={node}
          mounted={mounted}
          active={active}
          empty={empty}
          interactive={interactive}
          onSelectFacing={onSelectFacing}
          onRemoveWeapon={onRemoveWeapon}
        />
      </div>
    );
  };

  return (
    <div className="panel panel-corner p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h3
          className={`font-display text-xs tracking-[0.2em] glow-text ${
            isBayFighter ? 'text-amber' : 'text-cyan'
          }`}
        >
          {configTitle}
        </h3>
        <span className="font-mono-hud text-[10px] glow-green tracking-widest uppercase shrink-0">
          {isFighterHull ? (ship.isFighterBuild ? 'Fighter · Impulse' : 'Fighter') : `${ship.size} · DM ${dm}`}
        </span>
      </div>

      {isBayFighter && fighterBay!.type === 'none' && (
        <p className="text-slate-400 text-xs mb-3 font-mono-hud border border-slate-700 rounded-sm p-2">
          No fighter assigned — pick a craft in the Fighter Bay loadout item.
        </p>
      )}

      {isBayFighter && hull?.trait && (
        <p className="text-slate-500 text-[10px] mb-2 font-mono-hud leading-relaxed border-b border-slate-700/60 pb-2">
          {hull.trait}
        </p>
      )}

      {/* Corner stat readouts */}
      <div className="relative mb-2">
        <div className="grid grid-cols-3 gap-2 font-mono-hud text-[10px] leading-tight mb-3">
          <div>
            <div className="text-slate-400">SIZE</div>
            <div className="glow-green text-base font-display">{displaySize}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">MHP</div>
            <div className="text-cyan glow-text text-base">{hullNow}/{displayMhp}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400">AC</div>
            <div className="text-cyan glow-text text-base">{displayAc}</div>
          </div>
          {!isBayFighter && (
            <>
              <div>
                <div className="text-slate-400">PASS.</div>
                <div className="text-cyan glow-text text-base">{ship.passengers}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400">SHIELD</div>
                <div className="text-cyan glow-text text-base">{shieldNow}/{shieldMax}</div>
              </div>
            </>
          )}
          {isBayFighter && (
            <>
              <div>
                <div className="text-slate-400">MANU.</div>
                <div className="text-cyan glow-text text-base">{displayManeuver}°</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400">WEAP.</div>
                <div className="text-cyan glow-text text-base">{fighterBay!.weapons.length}</div>
              </div>
            </>
          )}
          <div className="text-right">
            <div className="text-slate-400">SPEED</div>
            <div className="text-cyan glow-text text-base">
              {(displaySpeed / 1000).toLocaleString()}k
            </div>
          </div>
        </div>

        {/* Fore arc — above hull */}
        <div className="mb-3 flex justify-center">
          <div className="w-[22%] min-w-[72px] max-w-[120px]">
            {renderMount({ facing: 'Forward', label: 'FORE' })}
          </div>
        </div>

        {/* Hull row: Port | schematic | Starboard */}
        <div className="flex items-center gap-2 min-h-[220px]">
          <div className="w-[22%] min-w-[72px] max-w-[120px] shrink-0">
            {renderMount(SIDE_NODES[0])}
          </div>

          <div className="relative flex-1 min-h-[200px]">
            {fighterBay?.type === 'none' ? <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono-hud text-xs">EMPTY BAY</div> : <ShipHullSchematic size={displaySize} mhp={hullNow} maxMhp={displayMhp} shields={shieldNow} maxShields={shieldMax} weapons={isBayFighter ? fighterBay!.weapons : ship.weapons} />}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[38%] pointer-events-auto">
                {renderMount({ facing: 'Turret', label: 'TURRET' })}
              </div>
            </div>
          </div>

          <div className="w-[22%] min-w-[72px] max-w-[120px] shrink-0">
            {renderMount(SIDE_NODES[1])}
          </div>
        </div>

        {/* Aft arc — below hull */}
        <div className="mt-3 flex justify-center">
          <div className="w-[22%] min-w-[72px] max-w-[120px]">
            {renderMount({ facing: 'Aft', label: 'AFT' })}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-display text-[10px] tracking-widest text-slate-300">
            HARDPOINT SLOTS
          </span>
          <span
            className={`font-mono-hud text-[11px] ${
              used > totalSlots ? 'text-danger' : 'text-cyan'
            }`}
          >
            {used}/{totalSlots}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {pips.map((filled, i) => (
            <span
              key={i}
              className={`w-3.5 h-3.5 rounded-[2px] border transition-colors ${
                filled
                  ? 'bg-cyan border-cyan shadow-[0_0_6px_#00e5ff80]'
                  : 'border-slate-600 bg-void/60'
              }`}
            />
          ))}
          {used > totalSlots &&
            Array.from({ length: used - totalSlots }, (_, i) => (
              <span
                key={`over-${i}`}
                className="w-3.5 h-3.5 rounded-[2px] border bg-danger border-danger shadow-[0_0_6px_#ff444480]"
              />
            ))}
        </div>

        {fighterBayTargets && fighterBayTargets.bays.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700/60">
            <p className="font-display text-[9px] tracking-widest text-slate-400 mb-2">
              CONFIGURE
            </p>
            <div className="flex gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => fighterBayTargets.onSelect('mothership')}
                className={`font-display text-[9px] tracking-widest px-2 py-1 rounded-sm border transition-all ${
                  fighterBayTargets.active === 'mothership'
                    ? 'border-cyan text-cyan bg-cyan/10'
                    : 'border-slate-700 text-slate-400 hover:border-cyan/50'
                }`}
              >
                MOTHERSHIP
              </button>
              {fighterBayTargets.bays.map((bay, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => fighterBayTargets.onSelect(i)}
                  className={`font-display text-[9px] tracking-widest px-2 py-1 rounded-sm border transition-all ${
                    bay.type === 'none'
                      ? 'border-slate-700 text-slate-500 opacity-60'
                      : fighterBayTargets.active === i
                        ? 'border-fuchsia-400 text-fuchsia-300 bg-fuchsia-500/25 shadow-[0_0_14px_rgba(217,70,239,0.65)] glow-fuchsia'
                        : 'border-fuchsia-500/70 text-fuchsia-400 bg-fuchsia-500/15 shadow-[0_0_10px_rgba(217,70,239,0.5)] glow-fuchsia hover:border-fuchsia-400'
                  }`}
                >
                  F{i + 1}
                  {bay.type !== 'none' && (
                    <span className="ml-1 opacity-75">
                      {fighterDisplayName(bay).slice(0, 6).toUpperCase()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 font-mono-hud text-[10px] text-slate-500 leading-relaxed border-t border-slate-700/60 pt-2">
        {isBayFighter
          ? 'Bay fighter weapons — select arc, then mount from the Weapons loadout (Fighter target).'
          : ship.isFighterBuild
            ? 'GM custom fighter: hull-specific slots, MHP ≥ 5 × pilot level, shield generator = 4 SP.'
            : "Escape Pods, Life Support, Sensors, Shield Generator, and Pilot's Seat are integrated into the hull. Only weapons mount to arc hardpoints — Fixed weapons on Fore/Port/Starboard/Aft; all others on the Turret."}
      </p>

      {interactive && fighterBay?.type !== 'none' && (
        <p className="mt-1 font-mono-hud text-[10px] text-slate-500 leading-relaxed">
          Select an arc facing, then mount a Fixed weapon below. Non-fixed weapons
          auto-mount on the Turret.
        </p>
      )}
    </div>
  );
}

function MountButton({
  node,
  mounted,
  active,
  empty,
  interactive,
  onSelectFacing,
  onRemoveWeapon,
}: {
  node: FacingNode;
  mounted: { weapon: { name: string }; index: number }[];
  active: boolean;
  empty: boolean;
  interactive: boolean;
  onSelectFacing?: (f: WeaponFacing) => void;
  onRemoveWeapon?: (index: number) => void;
}) {
  return (
    <div>
      <button
        type="button"
        disabled={!interactive}
        onClick={() => onSelectFacing?.(node.facing)}
        className={`w-full text-center rounded-sm border px-1 py-1.5 transition-all ${
          active
            ? 'border-cyan bg-cyan/20 shadow-[0_0_14px_#00e5ff]'
            : empty
              ? 'border-slate-600/70 bg-void/60'
              : 'border-amber/70 bg-amber/10'
        } ${interactive ? 'cursor-pointer hover:border-cyan' : 'cursor-default'}`}
      >
        <span
          className={`block font-display text-[9px] tracking-widest ${
            active ? 'text-cyan' : empty ? 'text-slate-400' : 'text-amber'
          }`}
        >
          {node.label}
        </span>
        <span className="block font-mono-hud text-[9px] text-slate-300">
          {mounted.length === 0 ? '—' : `${mounted.length} mount${mounted.length > 1 ? 's' : ''}`}
        </span>
      </button>

      {mounted.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {mounted.map(({ weapon, index }) => {
            const def = WEAPONS_BY_NAME[weapon.name];
            return (
              <li
                key={index}
                className="flex items-center justify-between gap-1 bg-void/80 border border-amber/30 rounded-sm px-1 py-0.5"
              >
                <span className="font-mono-hud text-[8.5px] text-slate-200 truncate">
                  {def?.name ?? weapon.name}
                </span>
                {onRemoveWeapon && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveWeapon(index);
                    }}
                    className="text-danger text-[10px] leading-none hover:scale-125 transition-transform"
                    title="Unmount"
                  >
                    ✕
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

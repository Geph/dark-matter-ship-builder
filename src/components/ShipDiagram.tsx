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
  const totalSlots = isBayFighter ? FIGHTER_SLOT_COUNT : ship.totalSlots;
  const dm = effectiveDmClass(ship);
  const pips = Array.from({ length: totalSlots }, (_, i) => i < used);

  const displaySize: ShipSize = isFighterHull ? 'Fighter' : ship.size;
  const displayMhp = isBayFighter ? (hull?.mhp ?? '—') : ship.mhp;
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
            <div className="text-cyan glow-text text-base">{displayMhp}</div>
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
                <div className="text-cyan glow-text text-base">{ship.shieldPoints}</div>
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
            <HullSvg size={displaySize} />
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
            ? 'Custom fighter: 6 slots, MHP ≥ 5 × level, shield generator = 8 SP. No standard Escape Pods or railguns.'
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

function hullVariant(size: ShipSize): 'personal' | 'transport' | 'corvette' | 'frigate' {
  if (size === 'Fighter' || size === 'Personal') return 'personal';
  if (size === 'Transport') return 'transport';
  if (size === 'Corvette') return 'corvette';
  return 'frigate';
}

function HullSvg({ size }: { size: ShipSize }) {
  const variant = hullVariant(size);
  const glow =
    variant === 'personal'
      ? '#00e5ff'
      : variant === 'transport'
        ? '#ffb300'
        : variant === 'corvette'
          ? '#38ff9c'
          : '#e879f9';

  return (
    <svg
      viewBox="0 0 250 300"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`hullFill-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={variant === 'frigate' ? '#1a1030' : '#0e2230'} />
          <stop offset="100%" stopColor="#0a131c" />
        </linearGradient>
        <filter id={`hullGlow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        filter={`url(#hullGlow-${variant})`}
        stroke={glow}
        strokeWidth="1.5"
        fill={`url(#hullFill-${variant})`}
      >
        {variant === 'personal' && <PersonalHull />}
        {variant === 'transport' && <TransportHull />}
        {variant === 'corvette' && <CorvetteHull />}
        {variant === 'frigate' && <FrigateHull />}
      </g>
    </svg>
  );
}

function PersonalHull() {
  return (
    <>
      <path d="M125 8 C138 26 145 50 146 78 L196 150 C205 160 205 176 190 182 L150 176 L152 250 L178 286 L150 282 L134 296 L125 286 L116 296 L100 282 L72 286 L98 250 L100 176 L60 182 C45 176 45 160 54 150 L104 78 C105 50 112 26 125 8 Z" />
      <ellipse cx="125" cy="70" rx="13" ry="22" fill="#0a131c" stroke="#00e5ff" strokeWidth="1" />
      <line x1="125" y1="96" x2="125" y2="250" stroke="#00e5ff" strokeWidth="0.6" opacity="0.4" />
      <circle cx="125" cy="168" r="20" fill="#0a131c" stroke="#ffb300" strokeWidth="1" opacity="0.7" />
      <rect x="108" y="262" width="10" height="20" rx="2" fill="#08222b" stroke="#00e5ff" strokeWidth="0.8" />
      <rect x="132" y="262" width="10" height="20" rx="2" fill="#08222b" stroke="#00e5ff" strokeWidth="0.8" />
    </>
  );
}

function TransportHull() {
  return (
    <>
      <path d="M125 20 L175 60 L195 140 L195 200 L175 260 L125 280 L75 260 L55 200 L55 140 L75 60 Z" />
      <rect x="95" y="80" width="60" height="100" rx="4" fill="#0a131c" stroke="#ffb300" strokeWidth="1" opacity="0.6" />
      <circle cx="125" cy="170" r="18" fill="#0a131c" stroke="#ffb300" strokeWidth="1" />
      <rect x="70" y="220" width="18" height="30" rx="2" fill="#08222b" />
      <rect x="162" y="220" width="18" height="30" rx="2" fill="#08222b" />
    </>
  );
}

function CorvetteHull() {
  return (
    <>
      <path d="M125 10 L200 80 L220 160 L200 240 L125 290 L50 240 L30 160 L50 80 Z" />
      <path d="M50 120 L30 160 L50 200 L70 160 Z" fill="#0a131c" opacity="0.8" />
      <path d="M200 120 L220 160 L200 200 L180 160 Z" fill="#0a131c" opacity="0.8" />
      <circle cx="125" cy="155" r="22" fill="#0a131c" stroke="#38ff9c" strokeWidth="1.2" />
      <rect x="108" y="255" width="14" height="22" rx="2" fill="#08222b" />
      <rect x="128" y="255" width="14" height="22" rx="2" fill="#08222b" />
    </>
  );
}

function FrigateHull() {
  return (
    <>
      <path d="M125 5 L210 70 L235 150 L210 230 L125 295 L40 230 L15 150 L40 70 Z" />
      <path d="M40 100 L15 150 L40 200 L65 150 Z" fill="#1a1030" opacity="0.9" />
      <path d="M210 100 L235 150 L210 200 L185 150 Z" fill="#1a1030" opacity="0.9" />
      <rect x="100" y="60" width="50" height="70" rx="3" fill="#0a131c" stroke="#e879f9" strokeWidth="1" />
      <circle cx="125" cy="175" r="26" fill="#0a131c" stroke="#e879f9" strokeWidth="1.2" />
      <rect x="95" y="250" width="20" height="28" rx="2" fill="#08222b" />
      <rect x="135" y="250" width="20" height="28" rx="2" fill="#08222b" />
    </>
  );
}

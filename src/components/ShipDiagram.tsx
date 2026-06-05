import type { Ship, WeaponFacing } from '../lib/types';
import { WEAPONS_BY_NAME } from '../data/weapons';
import { effectiveDmClass, slotsUsed, weaponsByFacing } from '../lib/rules';

// ============================================================
// Ship Configuration visual area.
// A top-down hull "record sheet" inspired by tabletop fighter
// sheets: weapons are mounted into facing arcs (Fore / Port /
// Starboard / Aft / Turret) and ship slots are shown as a pip
// grid. Doubles as an interactive mount selector in the builder
// and a static schematic on stat-block / public views.
// ============================================================

interface FacingNode {
  facing: WeaponFacing;
  label: string;
  /** Position as a percentage of the diagram box. */
  top: string;
  left: string;
}

// Placement of each facing mount point over the hull silhouette.
const NODES: FacingNode[] = [
  { facing: 'Forward', label: 'FORE', top: '4%', left: '50%' },
  { facing: 'Port', label: 'PORT', top: '46%', left: '8%' },
  { facing: 'Starboard', label: 'STBD', top: '46%', left: '92%' },
  { facing: 'Aft', label: 'AFT', top: '93%', left: '50%' },
  { facing: 'Turret', label: 'TURRET', top: '52%', left: '50%' },
];

interface Props {
  ship: Ship;
  /** When set, facing nodes become clickable mount selectors. */
  selectedFacing?: WeaponFacing;
  onSelectFacing?: (f: WeaponFacing) => void;
  /** When provided, weapons can be unmounted from the diagram. */
  onRemoveWeapon?: (index: number) => void;
}

export default function ShipDiagram({
  ship,
  selectedFacing,
  onSelectFacing,
  onRemoveWeapon,
}: Props) {
  const interactive = !!onSelectFacing;
  const byFacing = weaponsByFacing(ship);
  const used = slotsUsed(ship);
  const dm = effectiveDmClass(ship);

  // Slot pips: filled = used, framed = free capacity.
  const pips = Array.from({ length: ship.totalSlots }, (_, i) => i < used);

  return (
    <div className="panel panel-corner p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xs tracking-[0.25em] text-cyan glow-text">
          SHIP CONFIGURATION
        </h3>
        <span className="font-mono-hud text-[10px] text-amber tracking-widest">
          {ship.size.toUpperCase()} · DM {dm}
        </span>
      </div>

      {/* Corner stat readouts + hull schematic */}
      <div className="relative">
        <div className="absolute top-0 left-0 z-10 font-mono-hud text-[10px] leading-tight">
          <div className="text-slate-400">MHP</div>
          <div className="text-cyan glow-text text-base">{ship.mhp}</div>
        </div>
        <div className="absolute top-0 right-0 z-10 font-mono-hud text-[10px] leading-tight text-right">
          <div className="text-slate-400">AC</div>
          <div className="text-cyan glow-text text-base">{ship.ac}</div>
        </div>
        <div className="absolute bottom-0 left-0 z-10 font-mono-hud text-[10px] leading-tight">
          <div className="text-slate-400">SHIELD</div>
          <div className="text-cyan glow-text text-base">{ship.shieldPoints}</div>
        </div>
        <div className="absolute bottom-0 right-0 z-10 font-mono-hud text-[10px] leading-tight text-right">
          <div className="text-slate-400">SPEED</div>
          <div className="text-cyan glow-text text-base">
            {(ship.speed / 1000).toLocaleString()}k
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[320px]" style={{ aspectRatio: '5 / 6' }}>
          <HullSvg />

          {NODES.map((node) => {
            const mounted = byFacing[node.facing];
            const active = selectedFacing === node.facing;
            const empty = mounted.length === 0;
            return (
              <div
                key={node.facing}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[34%]"
                style={{ top: node.top, left: node.left }}
              >
                <button
                  type="button"
                  disabled={!interactive}
                  onClick={() => onSelectFacing?.(node.facing)}
                  className={`w-full text-center rounded-sm border px-1 py-1 transition-all ${
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
          })}
        </div>
      </div>

      {/* Slot pip grid (like a structural-integrity track) */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-display text-[10px] tracking-widest text-slate-300">
            HARDPOINT SLOTS
          </span>
          <span
            className={`font-mono-hud text-[11px] ${
              used > ship.totalSlots ? 'text-danger' : 'text-cyan'
            }`}
          >
            {used}/{ship.totalSlots}
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
          {/* Over-capacity overflow pips, shown in danger red. */}
          {used > ship.totalSlots &&
            Array.from({ length: used - ship.totalSlots }, (_, i) => (
              <span
                key={`over-${i}`}
                className="w-3.5 h-3.5 rounded-[2px] border bg-danger border-danger shadow-[0_0_6px_#ff444480]"
              />
            ))}
        </div>
      </div>

      {interactive && (
        <p className="mt-3 font-mono-hud text-[10px] text-slate-500 leading-relaxed border-t border-slate-700/60 pt-2">
          Select a facing arc, then add a weapon below to mount it there.
        </p>
      )}
    </div>
  );
}

// Stylized top-down hull silhouette.
function HullSvg() {
  return (
    <svg
      viewBox="0 0 250 300"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hullFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e2230" />
          <stop offset="100%" stopColor="#0a131c" />
        </linearGradient>
        <filter id="hullGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#hullGlow)" stroke="#00e5ff" strokeWidth="1.5" fill="url(#hullFill)">
        {/* Main fuselage: nose -> wings -> engine block */}
        <path
          d="M125 8
             C 138 26 145 50 146 78
             L 196 150
             C 205 160 205 176 190 182
             L 150 176
             L 152 250
             L 178 286
             L 150 282
             L 134 296
             L 125 286
             L 116 296
             L 100 282
             L 72 286
             L 98 250
             L 100 176
             L 60 182
             C 45 176 45 160 54 150
             L 104 78
             C 105 50 112 26 125 8 Z"
        />
        {/* Cockpit / bridge */}
        <ellipse cx="125" cy="70" rx="13" ry="22" fill="#0a131c" stroke="#00e5ff" strokeWidth="1" />
        {/* Spine line */}
        <line x1="125" y1="96" x2="125" y2="250" stroke="#00e5ff" strokeWidth="0.6" opacity="0.4" />
        {/* Turret ring */}
        <circle cx="125" cy="168" r="20" fill="#0a131c" stroke="#ffb300" strokeWidth="1" opacity="0.7" />
        <circle cx="125" cy="168" r="9" fill="none" stroke="#ffb300" strokeWidth="0.8" opacity="0.6" />
        {/* Engine nozzles */}
        <rect x="108" y="262" width="10" height="20" rx="2" fill="#08222b" stroke="#00e5ff" strokeWidth="0.8" />
        <rect x="132" y="262" width="10" height="20" rx="2" fill="#08222b" stroke="#00e5ff" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

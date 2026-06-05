import { useState } from 'react';
import type { Ship } from '../lib/types';
import { SYSTEMS_BY_ID } from '../data/systems';
import { UPGRADES_BY_ID } from '../data/upgrades';
import { WEAPONS_BY_NAME } from '../data/weapons';
import { CREW_ROLES_BY_ID } from '../data/crewRoles';
import { CREW_ACTIONS_BY_ROLE } from '../data/crewActions';
import CrewActionPanel from './CrewActionPanel';
import ShipIcon from './ShipIcon';
import { mapSizeFeet, shipDimensions } from '../data/shipStats';
import { fighterDisplayName } from '../data/fighters';
import {
  effectiveDmClass,
  slotsUsed,
  lockedInstalls,
  isHullEmbeddedSystem,
  gunnerAttackBonus,
  syncFighterBays,
} from '../lib/rules';

const STAT_LABEL = 'text-[9px] tracking-widest text-slate-400';
const STAT_VALUE = 'font-display text-[1.0125rem]';
const STAT_VALUE_CYAN = `${STAT_VALUE} text-cyan glow-text`;
const STAT_VALUE_GREEN = `${STAT_VALUE} glow-green`;

function AccordionSection({
  label,
  children,
  defaultOpen = true,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="my-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 group text-left"
        aria-expanded={open}
      >
        <span className="font-display text-[11px] tracking-[0.25em] text-amber whitespace-nowrap group-hover:text-amber/90">
          {label}
        </span>
        <span className="flex-1 h-px bg-amber/40" />
        <span
          className={`font-mono-hud text-[10px] text-slate-500 transition-transform ${open ? '' : '-rotate-90'}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-3">
      <span className="font-display text-[11px] tracking-[0.25em] text-amber whitespace-nowrap">
        {label}
      </span>
      <span className="flex-1 h-px bg-amber/40" />
    </div>
  );
}

interface Props {
  ship: Ship;
  showCombat?: boolean;
  hideCrewActions?: boolean;
  /** Keep crew actions on screen but omit from print (use CrewActionsPrint instead). */
  crewActionsNoPrint?: boolean;
  showHeaderIcon?: boolean;
  /** When set, MHP and Shield current values are editable and persisted via this callback. */
  onUpdate?: (mutator: (s: Ship) => Ship) => void;
}

function clampStatValue(raw: string, max: number): number {
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(0, n), max);
}

export default function StatBlock({
  ship,
  showCombat = false,
  hideCrewActions = false,
  crewActionsNoPrint = false,
  showHeaderIcon = false,
  onUpdate,
}: Props) {
  const [editingDimensions, setEditingDimensions] = useState(false);
  const dm = effectiveDmClass(ship);
  const used = slotsUsed(ship);
  const systemEntries = Object.entries(ship.systems).filter(([, c]) => c > 0);
  const editable = !!onUpdate;
  const dimensionsDisplay = shipDimensions(ship.size, ship.dimensionsOverride);

  const mhpMax = ship.mhp;
  const shieldMax = ship.shieldPoints;
  const mhpNow = ship.mhpCurrent ?? mhpMax;
  const shieldNow = ship.shieldCurrent ?? shieldMax;

  const stat = (label: string, value: React.ReactNode, highlight = false) => (
    <div className="flex flex-col min-w-0">
      <span className={`font-mono-hud ${STAT_LABEL}`}>{label}</span>
      <span className={highlight ? STAT_VALUE_GREEN : STAT_VALUE_CYAN}>{value}</span>
    </div>
  );

  const fractionStat = (
    label: string,
    current: number,
    max: number,
    field: 'mhpCurrent' | 'shieldCurrent',
    inputClass = 'w-[2.75rem]',
  ) => (
    <div className="flex flex-col min-w-0">
      <span className={`font-mono-hud ${STAT_LABEL}`}>{label}</span>
      {editable ? (
        <div className={`flex items-baseline gap-0.5 ${STAT_VALUE}`}>
          <input
            type="number"
            min={0}
            max={max}
            value={current}
            onChange={(e) => {
              const v = clampStatValue(e.target.value, max);
              onUpdate!((s) => ({ ...s, [field]: v }));
            }}
            className={`${inputClass} min-w-0 bg-void/80 border border-cyan/40 rounded-sm px-1 py-0 font-display text-[1.0125rem] text-cyan glow-text text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            aria-label={`${label} current`}
          />
          <span className="text-slate-500 font-mono-hud text-[0.9rem]">/</span>
          <span className={STAT_VALUE_CYAN}>{max}</span>
        </div>
      ) : (
        <span className={STAT_VALUE_CYAN}>
          {current} / {max}
        </span>
      )}
    </div>
  );

  const dimensionsStat = () => (
    <div className="flex flex-col min-w-0">
      <span className={`font-mono-hud ${STAT_LABEL}`}>DIMENSIONS</span>
      {editable && editingDimensions ? (
        <input
          type="text"
          value={ship.dimensionsOverride ?? mapSizeFeet(ship.size)}
          onChange={(e) => {
            const next = e.target.value;
            onUpdate!((s) => ({
              ...s,
              dimensionsOverride:
                next.trim() === '' || next === mapSizeFeet(s.size) ? null : next,
            }));
          }}
          onBlur={() => setEditingDimensions(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setEditingDimensions(false);
          }}
          autoFocus
          className="w-full min-w-0 bg-void/80 border border-cyan/40 rounded-sm px-1 py-0 font-display text-[0.85rem] sm:text-[1.0125rem] text-cyan glow-text [appearance:textfield]"
          aria-label="Dimensions"
        />
      ) : (
        <button
          type="button"
          onClick={() => editable && setEditingDimensions(true)}
          className={`${STAT_VALUE_CYAN} text-left break-words ${editable ? 'cursor-pointer hover:text-cyan/80' : 'cursor-default'}`}
          disabled={!editable}
          title={editable ? 'Click to edit dimensions' : undefined}
        >
          {dimensionsDisplay}
        </button>
      )}
    </div>
  );

  const fightersBlock =
    syncFighterBays(ship).some((b) => b.type !== 'none') ? (
      <>
        <Divider label="FIGHTERS" />
        <ul className="space-y-3 text-sm">
          {syncFighterBays(ship).map((bay, i) => {
            if (bay.type === 'none') return null;
              const label = fighterDisplayName(bay);
            return (
              <li key={i} className="text-slate-200">
                <div className="text-amber font-display text-xs tracking-wider">
                  Bay {i + 1}: {label}
                </div>
                {bay.weapons.length === 0 ? (
                  <p className="text-slate-500 text-xs pl-2">Stock loadout</p>
                ) : (
                  <ul className="pl-2 mt-1 space-y-1">
                    {bay.weapons.map((w, wi) => {
                      const def = WEAPONS_BY_NAME[w.name];
                      if (!def) return null;
                      return (
                        <li key={wi} className="text-xs text-slate-300">
                          <span className="text-cyan">▸</span> {def.name}{' '}
                          <span className="text-amber">[{w.facing}]</span> — {def.damage}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </>
    ) : null;

  return (
    <div className="panel panel-corner print-card p-5 sm:p-6 font-mono-hud">
      <div className="text-center border-b border-cyan/40 pb-3 mb-4">
        {showHeaderIcon && ship.iconId && (
          <div className="flex justify-center mb-2">
            <ShipIcon iconId={ship.iconId} className="w-14 h-14 sm:w-16 sm:h-16" alt="" />
          </div>
        )}
        <h2 className="font-display text-2xl sm:text-3xl text-cyan glow-text tracking-wider break-words">
          {ship.name || 'UNNAMED VESSEL'}
        </h2>
        <p className="glow-green tracking-[0.3em] text-sm mt-1 uppercase font-display">
          {ship.size} &nbsp;•&nbsp; Dark Matter Class {dm}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-2">
        {stat('CLASS', ship.size, true)}
        {fractionStat('MHP', mhpNow, mhpMax, 'mhpCurrent', 'w-[4.25rem]')}
        {stat('AC', ship.ac)}
        {fractionStat('SHIELD', shieldNow, shieldMax, 'shieldCurrent')}
        {stat('PASSENGERS', ship.passengers)}
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-2">
        {stat('SLOTS', `${used}/${ship.totalSlots}`)}
        {stat('SPEED', `${ship.speed.toLocaleString()} ft`)}
        {stat('MANU.', `${ship.maneuverability}°`)}
        {stat('CARGO', `${ship.cargo.toLocaleString()} t`)}
        {dimensionsStat()}
      </div>

      <AccordionSection label="SYSTEMS">
        <p className="text-slate-500 text-[10px] mb-2">
          Hull-embedded systems are pre-installed in the body and do not use weapon mount points.
        </p>
        {systemEntries.length === 0 ? (
          <p className="text-slate-500 text-sm">No systems installed.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {systemEntries.map(([id, count]) => {
              const def = SYSTEMS_BY_ID[id];
              if (!def) return null;
              const locked = lockedInstalls(ship, id);
              const inHull = isHullEmbeddedSystem(id);
              return (
                <li key={id} className="text-slate-200">
                  <span className="text-cyan">▸</span> {def.name}
                  {count > 1 && <span className="text-amber"> ×{count}</span>}
                  {inHull && locked > 0 && (
                    <span className="text-ok text-[10px] ml-1">[IN HULL]</span>
                  )}
                  {locked > 0 && !inHull && (
                    <span className="text-ok text-[10px] ml-1">[GRANTED]</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {fightersBlock}
      </AccordionSection>

      <AccordionSection label="WEAPONS">
        {ship.weapons.length === 0 ? (
          <p className="text-slate-500 text-sm">No weapons mounted.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {ship.weapons.map((w, i) => {
              const def = WEAPONS_BY_NAME[w.name];
              if (!def) return null;
              return (
                <li key={i} className="text-slate-200">
                  <div>
                    <span className="text-cyan">▸</span> {def.name}{' '}
                    <span className="text-amber">[{w.facing}]</span> —{' '}
                    <span className="text-slate-100">{def.damage}</span>
                  </div>
                  <div className="text-slate-400 text-xs pl-4">
                    {def.properties} &nbsp;|&nbsp; Mastery: {def.mastery}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AccordionSection>

      <AccordionSection label="UPGRADES">
        {ship.upgrades.length === 0 ? (
          <p className="text-slate-500 text-sm">No upgrades installed.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {ship.upgrades.map((id) => {
              const def = UPGRADES_BY_ID[id];
              if (!def) return null;
              return (
                <li key={id} className="text-slate-200">
                  <span className="text-cyan">▸</span> {def.name}
                </li>
              );
            })}
          </ul>
        )}
      </AccordionSection>

      {!hideCrewActions && (
        <div className={crewActionsNoPrint ? 'no-print' : undefined}>
          <Divider label={showCombat ? 'CREW ACTIONS' : 'CREW'} />
          {ship.crewRoles.length === 0 ? (
            <p className="text-slate-500 text-sm">No crew roles assigned.</p>
          ) : showCombat ? (
            <ul className="space-y-3 text-sm">
              {ship.crewRoles.map((roleId) => {
                const role = CREW_ROLES_BY_ID[roleId];
                const member = ship.crewMembers?.[roleId];
                const actions = CREW_ACTIONS_BY_ROLE[roleId] ?? [];
                if (!role) return null;
                return (
                  <CrewActionPanel
                    key={roleId}
                    ship={ship}
                    roleId={roleId}
                    roleLabel={role.label}
                    memberName={member?.name}
                    skillModifier={member?.skillModifier ?? 0}
                    attackBonus={
                      roleId === 'gunner'
                        ? gunnerAttackBonus(ship)
                        : (member?.attackBonus ?? member?.skillModifier ?? 0)
                    }
                    actions={actions}
                  />
                );
              })}
            </ul>
          ) : (
            <ul className="space-y-2 text-sm">
              {ship.crewRoles.map((roleId) => {
                const role = CREW_ROLES_BY_ID[roleId];
                const member = ship.crewMembers?.[roleId];
                if (!role) return null;
                return (
                  <li key={roleId} className="text-slate-200 panel p-2">
                    <div className="font-display text-cyan text-xs tracking-wide">
                      {role.label}
                      {member?.name ? ` — ${member.name}` : ''}
                    </div>
                    {member && (
                      <div className="text-slate-400 text-[11px] mt-1 flex flex-wrap gap-x-3">
                        {role.skillFields
                          .filter((f) => f.key !== 'name' && f.key !== 'megaSpells')
                          .map((f) => (
                            <span key={f.key}>
                              {f.label}:{' '}
                              <span className="text-amber">
                                {member[f.key] !== undefined &&
                                member[f.key] !== '' &&
                                member[f.key] !== 0
                                  ? String(member[f.key])
                                  : member[f.key] === 0
                                    ? '0'
                                    : '—'}
                              </span>
                            </span>
                          ))}
                        {member.megaSpells?.length > 0 && (
                          <span>
                            Mega Spells:{' '}
                            <span className="text-fuchsia-400">
                              {member.megaSpells
                                .map((id) => id.replace(/-/g, ' '))
                                .join(', ')}
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <AccordionSection label="DESCRIPTION">
        <div className="space-y-1.5 text-sm">
          {ship.appearance && (
            <p>
              <span className="text-amber">Appearance:</span> {ship.appearance}
            </p>
          )}
          {ship.condition && (
            <p>
              <span className="text-amber">Condition:</span> {ship.condition}
            </p>
          )}
          {ship.interior && (
            <p>
              <span className="text-amber">Interior:</span> {ship.interior}
            </p>
          )}
          {ship.uniqueTrait && (
            <p>
              <span className="text-amber">Unique:</span> {ship.uniqueTrait}
            </p>
          )}
          {!ship.appearance &&
            !ship.condition &&
            !ship.interior &&
            !ship.uniqueTrait && (
              <p className="text-slate-500">No description recorded.</p>
            )}
        </div>
      </AccordionSection>
    </div>
  );
}

import type { Ship } from '../lib/types';
import { SYSTEMS_BY_ID } from '../data/systems';
import { UPGRADES_BY_ID } from '../data/upgrades';
import { WEAPONS_BY_NAME } from '../data/weapons';
import { CREW_ROLES } from '../data/crewRoles';
import { effectiveDmClass, slotsUsed } from '../lib/rules';

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

export default function StatBlock({ ship }: { ship: Ship }) {
  const dm = effectiveDmClass(ship);
  const used = slotsUsed(ship);
  const systemEntries = Object.entries(ship.systems).filter(([, c]) => c > 0);

  const stat = (label: string, value: React.ReactNode) => (
    <div className="flex flex-col">
      <span className="font-mono-hud text-[10px] tracking-widest text-slate-400">{label}</span>
      <span className="font-display text-lg text-cyan glow-text">{value}</span>
    </div>
  );

  return (
    <div className="panel panel-corner print-card p-5 sm:p-6 font-mono-hud">
      {/* Header */}
      <div className="text-center border-b border-cyan/40 pb-3 mb-4">
        <h2 className="font-display text-2xl sm:text-3xl text-cyan glow-text tracking-wider break-words">
          {ship.name || 'UNNAMED VESSEL'}
        </h2>
        <p className="text-amber tracking-[0.3em] text-xs mt-1 uppercase">
          {ship.size} &nbsp;•&nbsp; Dark Matter Class {dm}
        </p>
      </div>

      {/* Core stats */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-2">
        {stat('MHP', ship.mhp)}
        {stat('AC', ship.ac)}
        {stat('SHIELD', ship.shieldPoints)}
        {stat('SLOTS', `${used}/${ship.totalSlots}`)}
        {stat('SPEED', `${ship.speed.toLocaleString()} ft`)}
        {stat('MANU.', `${ship.maneuverability}°`)}
        {stat('CARGO', `${ship.cargo.toLocaleString()} t`)}
        {stat('PASS.', ship.passengers)}
      </div>

      {/* Systems */}
      <Divider label="SYSTEMS" />
      {systemEntries.length === 0 ? (
        <p className="text-slate-500 text-sm">No systems installed.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {systemEntries.map(([id, count]) => {
            const def = SYSTEMS_BY_ID[id];
            if (!def) return null;
            return (
              <li key={id} className="text-slate-200">
                <span className="text-cyan">▸</span> {def.name}
                {count > 1 && <span className="text-amber"> ×{count}</span>}
              </li>
            );
          })}
        </ul>
      )}

      {/* Weapons */}
      <Divider label="WEAPONS" />
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

      {/* Upgrades */}
      <Divider label="UPGRADES" />
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

      {/* Description */}
      <Divider label="DESCRIPTION" />
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
        {ship.crewRoles.length > 0 && (
          <p>
            <span className="text-amber">Crew:</span>{' '}
            {ship.crewRoles
              .map((id) => CREW_ROLES.find((r) => r.id === id)?.label ?? id)
              .join(', ')}
          </p>
        )}
        {!ship.appearance &&
          !ship.condition &&
          !ship.interior &&
          !ship.uniqueTrait &&
          ship.crewRoles.length === 0 && (
            <p className="text-slate-500">No description recorded.</p>
          )}
      </div>
    </div>
  );
}

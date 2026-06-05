import type { Ship } from '../../lib/types';
import { CREW_ROLES, CREW_ROLES_BY_ID } from '../../data/crewRoles';
import { SYSTEMS_BY_ID } from '../../data/systems';
import { statsForLevel } from '../../data/shipStats';
import { budgetForLevel } from '../../lib/rules';

interface Props {
  ship: Ship;
  update: (mutator: (s: Ship) => Ship) => void;
}

export default function StepCrew({ ship, update }: Props) {
  const stats = statsForLevel(ship.level);
  const budget = budgetForLevel(ship.level, ship.players);

  const toggleRole = (roleId: string) => {
    update((s) => {
      const has = s.crewRoles.includes(roleId);
      return {
        ...s,
        crewRoles: has
          ? s.crewRoles.filter((r) => r !== roleId)
          : [...s.crewRoles, roleId],
      };
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-xl text-cyan glow-text tracking-wider">
          STEP 1 · CREW MANIFEST
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Set your party level and roster. Each chosen role automatically installs
          its crew system for free.
        </p>
      </header>

      {/* Level + players */}
      <div className="panel p-4 grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="font-display text-[11px] tracking-widest text-slate-300">
            HIGHEST CHARACTER LEVEL
          </span>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range"
              min={1}
              max={20}
              value={ship.level}
              onChange={(e) => update((s) => ({ ...s, level: Number(e.target.value) }))}
              className="flex-1 accent-cyan"
            />
            <span className="font-mono-hud text-cyan glow-text text-xl w-10 text-right">
              {ship.level}
            </span>
          </div>
          <p className="text-amber font-mono-hud text-xs mt-2 tracking-wide">
            {stats.size} · DM Class {stats.dmClass} · {stats.slots} slots · MHP {stats.mhp}
          </p>
        </label>

        <label className="block">
          <span className="font-display text-[11px] tracking-widest text-slate-300">
            NUMBER OF PLAYERS
          </span>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range"
              min={1}
              max={8}
              value={ship.players}
              onChange={(e) => update((s) => ({ ...s, players: Number(e.target.value) }))}
              className="flex-1 accent-amber"
            />
            <span className="font-mono-hud text-amber glow-amber text-xl w-10 text-right">
              {ship.players}
            </span>
          </div>
          <p className="text-cyan font-mono-hud text-xs mt-2 tracking-wide">
            Budget: {budget.toLocaleString()} CR
          </p>
        </label>
      </div>

      {/* Crew role cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {CREW_ROLES.map((role) => {
          const selected = ship.crewRoles.includes(role.id);
          const locked = role.minLevel != null && ship.level < role.minLevel;
          const sys = SYSTEMS_BY_ID[role.systemId];
          return (
            <button
              key={role.id}
              type="button"
              disabled={locked}
              onClick={() => toggleRole(role.id)}
              title={locked ? `Requires level ${role.minLevel}+` : undefined}
              className={`text-left panel p-4 transition-all ${
                selected
                  ? 'border-cyan! shadow-[0_0_16px_#00e5ff66]'
                  : 'hover:border-cyan/60'
              } ${locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-cyan tracking-wide">{role.label}</span>
                {selected && <span className="text-ok text-sm">✓ INSTALLED</span>}
                {locked && <span className="text-danger text-[10px] font-mono-hud">LVL {role.minLevel}+</span>}
              </div>
              <p className="text-slate-400 text-sm mt-1">{role.description}</p>
              <p className="text-amber font-mono-hud text-[11px] mt-2">
                ⮡ Grants: {sys?.name} (free)
              </p>
            </button>
          );
        })}
      </div>

      {ship.crewRoles.length > 0 && (
        <div className="panel p-3 font-mono-hud text-xs text-slate-300">
          <span className="text-amber">CREW:</span>{' '}
          {ship.crewRoles.map((r) => CREW_ROLES_BY_ID[r]?.label ?? r).join(' · ')}
        </div>
      )}
    </div>
  );
}

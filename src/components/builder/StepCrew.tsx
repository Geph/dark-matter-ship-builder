import type { CrewMemberData, Ship } from '../../lib/types';
import { CREW_ROLES, CREW_ROLES_BY_ID } from '../../data/crewRoles';
import { SYSTEMS_BY_ID } from '../../data/systems';
import { MEGA_SPELLS } from '../../data/megaSpells';
import { statsForLevel } from '../../data/shipStats';
import { FIGHTER_CATALOG, fighterHullById } from '../../data/fighters';
import { customFighterMhp, effectiveBudget, setFighterBuildHull } from '../../lib/rules';
import PortraitUpload from '../PortraitUpload';

interface Props {
  ship: Ship;
  update: (mutator: (s: Ship) => Ship) => void;
}

const emptyMember = (): CrewMemberData => ({
  name: '',
  skillModifier: 0,
  attackBonus: 0,
  megaSpells: [],
  imageDataUrl: null,
});

export default function StepCrew({ ship, update }: Props) {
  const stats = statsForLevel(ship.level);
  const budget = effectiveBudget(ship);
  const fighterHull = ship.isFighterBuild
    ? fighterHullById(ship.fighterHullId ?? 'sabre')
    : null;

  const toggleFighterBuild = (enabled: boolean) => {
    update((s) => {
      if (enabled) {
        const pilot = s.crewMembers.pilot ?? emptyMember();
        const hullId = s.fighterHullId ?? 'sabre';
        return setFighterBuildHull(
          {
            ...s,
            isFighterBuild: true,
            players: 1,
            crewRoles: ['pilot'],
            crewMembers: { pilot },
            fighterHullId: hullId,
            upgradedDmClass: null,
            systems: {},
            upgrades: [],
          },
          hullId,
        );
      }
      return { ...s, isFighterBuild: false };
    });
  };

  const toggleRole = (roleId: string) => {
    update((s) => {
      const has = s.crewRoles.includes(roleId);
      const crewRoles = has
        ? s.crewRoles.filter((r) => r !== roleId)
        : [...s.crewRoles, roleId];
      const crewMembers = { ...s.crewMembers };
      if (has) {
        delete crewMembers[roleId];
      } else {
        crewMembers[roleId] = crewMembers[roleId] ?? emptyMember();
      }
      return { ...s, crewRoles, crewMembers };
    });
  };

  const updateMember = (roleId: string, key: keyof CrewMemberData, value: string | number) => {
    update((s) => {
      const current = s.crewMembers[roleId] ?? emptyMember();
      const crewMembers = {
        ...s.crewMembers,
        [roleId]: { ...current, [key]: value },
      };
      return { ...s, crewMembers };
    });
  };

  const updateMemberPortrait = (roleId: string, imageDataUrl: string | null) => {
    update((s) => {
      const current = s.crewMembers[roleId] ?? emptyMember();
      return {
        ...s,
        crewMembers: {
          ...s.crewMembers,
          [roleId]: { ...current, imageDataUrl },
        },
      };
    });
  };

  const updateGunnerMegaSpells = (selected: string[]) => {
    update((s) => {
      const current = s.crewMembers.gunner ?? emptyMember();
      return {
        ...s,
        crewMembers: {
          ...s.crewMembers,
          gunner: { ...current, megaSpells: selected },
        },
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
          its crew system for free. Enter skill modifiers for in-play rolls on the
          ship page.
        </p>
      </header>

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
          <p className="glow-green font-mono-hud text-xs mt-2 tracking-wide uppercase">
            {ship.isFighterBuild && fighterHull
              ? `Fighter · ${fighterHull.name} · 6 slots · MHP ${customFighterMhp(ship)} (min ${5 * ship.level}) · AC ${fighterHull.ac}`
              : `${stats.size} · DM Class ${stats.dmClass} · ${stats.slots} slots · MHP ${stats.mhp}`}
          </p>

          <label className="flex items-center gap-2 mt-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={ship.isFighterBuild}
              onChange={(e) => toggleFighterBuild(e.target.checked)}
              className="accent-amber w-4 h-4"
            />
            <span className="font-display text-[11px] tracking-widest text-amber group-hover:text-amber/90">
              CUSTOM FIGHTER BUILD
            </span>
          </label>
          <p className="text-slate-500 text-[10px] font-mono-hud mt-1 pl-6">
            Pilot only · 1 player · 6 slots · pick a fighter-class hull from the catalog.
          </p>

          {ship.isFighterBuild && (
            <label className="block mt-3 pl-6">
              <span className="font-mono-hud text-[10px] text-slate-400">Fighter hull template</span>
              <select
                value={ship.fighterHullId ?? 'sabre'}
                onChange={(e) => update((s) => setFighterBuildHull(s, e.target.value))}
                className="w-full mt-1 text-sm"
              >
                {FIGHTER_CATALOG.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.subtitle} (AC {h.ac}, MHP {h.mhp})
                  </option>
                ))}
              </select>
            </label>
          )}
        </label>

        <label className={`block ${ship.isFighterBuild ? 'opacity-40' : ''}`}>
          <span className="font-display text-[11px] tracking-widest text-slate-300">
            NUMBER OF PLAYERS
          </span>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range"
              min={1}
              max={8}
              value={ship.players}
              disabled={ship.isFighterBuild}
              onChange={(e) => update((s) => ({ ...s, players: Number(e.target.value) }))}
              className="flex-1 accent-amber disabled:cursor-not-allowed"
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

      <div className="grid sm:grid-cols-2 gap-3">
        {CREW_ROLES.map((role) => {
          const selected = ship.crewRoles.includes(role.id);
          const fighterLocked = ship.isFighterBuild && role.id !== 'pilot';
          const locked =
            fighterLocked || (role.minLevel != null && ship.level < role.minLevel);
          const sys = SYSTEMS_BY_ID[role.systemId];
          const member = ship.crewMembers[role.id];
          return (
            <div
              key={role.id}
              className={`panel p-4 transition-all ${
                selected ? 'border-cyan! shadow-[0_0_16px_#00e5ff66]' : ''
              } ${locked ? 'opacity-40' : ''}`}
            >
              <button
                type="button"
                disabled={locked}
                onClick={() => toggleRole(role.id)}
                title={
                  fighterLocked
                    ? 'Custom fighter builds require Pilot only.'
                    : locked
                      ? `Requires level ${role.minLevel}+`
                      : undefined
                }
                className={`w-full text-left ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-cyan tracking-wide">{role.label}</span>
                  {selected && <span className="text-ok text-sm">✓ INSTALLED</span>}
                  {locked && (
                    <span className="text-danger text-[10px] font-mono-hud">LVL {role.minLevel}+</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mt-1">{role.description}</p>
                <p className="text-amber font-mono-hud text-[11px] mt-2">
                  ⮡ Grants: {sys?.name} (free)
                </p>
              </button>

              {selected && (
                <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-2">
                  <p className="font-display text-[10px] tracking-widest text-slate-400">
                    SKILL DATA FOR ROLLS
                  </p>
                  {role.skillFields.map((field) => (
                    <label key={field.key} className="block">
                      <span className="font-mono-hud text-[10px] text-slate-400">{field.label}</span>
                      {field.key === 'name' ? (
                        <input
                          type="text"
                          value={member?.name ?? ''}
                          placeholder={field.hint}
                          onChange={(e) => updateMember(role.id, 'name', e.target.value)}
                          className="w-full mt-0.5 text-sm"
                        />
                      ) : (
                        <input
                          type="number"
                          value={member?.[field.key] ?? 0}
                          title={field.hint}
                          onChange={(e) =>
                            updateMember(role.id, field.key, Number(e.target.value))
                          }
                          className="w-full mt-0.5 text-sm"
                        />
                      )}
                    </label>
                  ))}

                  <PortraitUpload
                    label="CREW PORTRAIT"
                    hint="Optional picture shown on the ship sheet crew action panel."
                    value={member?.imageDataUrl}
                    onChange={(url) => updateMemberPortrait(role.id, url)}
                    aspectRatio={1}
                    maxWidth={320}
                    compact
                  />

                  {role.id === 'gunner' && (
                    <label className="block mt-2">
                      <span className="font-mono-hud text-[10px] text-fuchsia-400">
                        MEGA SPELLS (pp. 402–405)
                      </span>
                      <p className="text-slate-500 text-[10px] mb-1">
                        Requires Arcane Cannon on the ship. Hold Ctrl/Cmd to select multiple.
                      </p>
                      <select
                        multiple
                        size={6}
                        value={member?.megaSpells ?? []}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions).map(
                            (o) => o.value,
                          );
                          updateGunnerMegaSpells(selected);
                        }}
                        className="w-full text-sm font-mono-hud min-h-[120px]"
                      >
                        {MEGA_SPELLS.map((spell) => (
                          <option key={spell.id} value={spell.id}>
                            L{spell.level} {spell.name} — {spell.damage}
                          </option>
                        ))}
                      </select>
                      {(member?.megaSpells?.length ?? 0) > 0 && (
                        <p className="text-ok text-[10px] mt-1">
                          {member?.megaSpells.length} spell
                          {member!.megaSpells.length !== 1 ? 's' : ''} selected for ship sheet
                          actions
                        </p>
                      )}
                    </label>
                  )}
                </div>
              )}
            </div>
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

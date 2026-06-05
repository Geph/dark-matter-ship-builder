import type { Ship } from '../lib/types';
import { CREW_ROLES_BY_ID } from '../data/crewRoles';
import { CREW_ACTIONS_BY_ROLE, isActionAvailable } from '../data/crewActions';
import { WEAPONS_BY_NAME } from '../data/weapons';
import { MEGA_SPELLS_BY_ID } from '../data/megaSpells';

interface Props {
  ship: Ship;
}

/** Linear crew-action reference appended at the end of a printout. */
export default function CrewActionsPrint({ ship }: Props) {
  const roles = ship.crewRoles.filter((id) => CREW_ROLES_BY_ID[id]);
  if (roles.length === 0) return null;

  const hasArcaneCannon = (ship.systems['arcane-cannon'] ?? 0) > 0;
  const gunnerSpells = ship.crewMembers?.gunner?.megaSpells ?? [];

  return (
    <div className="hidden print:block print-card panel panel-corner p-5 sm:p-6 font-mono-hud mt-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-display text-[11px] tracking-[0.25em] text-amber whitespace-nowrap">
          CREW ACTIONS
        </span>
        <span className="flex-1 h-px bg-amber/40" />
      </div>

      <div className="space-y-5">
        {roles.map((roleId) => {
          const role = CREW_ROLES_BY_ID[roleId];
          const member = ship.crewMembers?.[roleId];
          const actions = CREW_ACTIONS_BY_ROLE[roleId] ?? [];
          if (!role) return null;

          return (
            <section key={roleId}>
              <h3 className="font-display text-sm tracking-wide text-cyan mb-2">
                {role.label}
                {member?.name ? ` — ${member.name}` : ''}
              </h3>

              <ul className="space-y-2 text-sm">
                {actions.map((action) => {
                  const avail = isActionAvailable(action, ship);
                  return (
                    <li key={action.id} className={!avail.ok ? 'opacity-60' : undefined}>
                      <p className="font-display text-xs tracking-wide">{action.name}</p>
                      <p className="text-[11px] leading-relaxed">{action.description}</p>
                      {!avail.ok && avail.reason && (
                        <p className="text-[10px] mt-0.5">{avail.reason}</p>
                      )}
                    </li>
                  );
                })}

                {roleId === 'gunner' && ship.weapons.length > 0 && (
                  <li>
                    <p className="font-display text-xs tracking-wide mt-1">Mounted Weapons</p>
                    <ul className="mt-1 space-y-1 text-[11px]">
                      {ship.weapons.map((w, i) => {
                        const def = WEAPONS_BY_NAME[w.name];
                        if (!def) return null;
                        return (
                          <li key={i}>
                            {def.name} [{w.facing}] — {def.damage}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                )}

                {roleId === 'gunner' && hasArcaneCannon && gunnerSpells.length > 0 && (
                  <li>
                    <p className="font-display text-xs tracking-wide mt-1">
                      Mega Spells (Arcane Cannon)
                    </p>
                    <ul className="mt-1 space-y-2 text-[11px]">
                      {gunnerSpells.map((spellId) => {
                        const spell = MEGA_SPELLS_BY_ID[spellId];
                        if (!spell) return null;
                        return (
                          <li key={spellId}>
                            <p>
                              {spell.name} (level {spell.level}) — {spell.damage}
                            </p>
                            <p>{spell.description}</p>
                            {spell.save && (
                              <p>
                                Save: {spell.save} ({spell.saveEffect ?? 'see spell'})
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { Ship } from '../lib/types';
import { CREW_ROLES_BY_ID } from '../data/crewRoles';
import { CREW_ACTIONS_BY_ROLE } from '../data/crewActions';
import CrewActionPanel from './CrewActionPanel';
import { gunnerAttackBonus } from '../lib/rules';

interface Props {
  ship: Ship;
}

export default function CrewActionTabs({ ship }: Props) {
  const roles = ship.crewRoles.filter((id) => CREW_ROLES_BY_ID[id]);
  const [active, setActive] = useState(roles[0] ?? '');

  if (roles.length === 0) {
    return (
      <div className="panel p-4">
        <p className="text-slate-500 text-sm font-mono-hud">No crew roles assigned.</p>
      </div>
    );
  }

  const roleId = active || roles[0];
  const role = CREW_ROLES_BY_ID[roleId];
  const member = ship.crewMembers?.[roleId];
  const actions = CREW_ACTIONS_BY_ROLE[roleId] ?? [];

  return (
    <div className="space-y-3">
      <div className="flex gap-1 flex-wrap">
        {roles.map((id) => {
          const r = CREW_ROLES_BY_ID[id];
          if (!r) return null;
          const selected = id === roleId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`font-display text-[10px] tracking-widest px-3 py-2 rounded-sm border transition-all ${
                selected
                  ? 'border-cyan text-cyan bg-cyan/10 shadow-[0_0_12px_#00e5ff55]'
                  : 'border-slate-700 text-slate-400 hover:text-cyan hover:border-cyan/50'
              }`}
            >
              {r.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {role && (
        <CrewActionPanel
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
      )}
    </div>
  );
}

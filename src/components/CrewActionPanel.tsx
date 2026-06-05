import { useState } from 'react';
import type { Ship } from '../lib/types';
import type { CrewActionDef } from '../data/crewActions';
import { isActionAvailable, ramDamageDice } from '../data/crewActions';
import { WEAPONS_BY_NAME } from '../data/weapons';
import { MEGA_SPELLS_BY_ID } from '../data/megaSpells';
import { rollD20, rollWeaponDamage, rollDice, parseDamageDice } from '../lib/dice';

interface Props {
  ship: Ship;
  roleId: string;
  roleLabel: string;
  memberName?: string;
  portraitUrl?: string | null;
  skillModifier: number;
  attackBonus: number;
  actions: CrewActionDef[];
}

export default function CrewActionPanel({
  ship,
  roleId,
  roleLabel,
  memberName,
  portraitUrl,
  skillModifier,
  attackBonus,
  actions,
}: Props) {
  const [results, setResults] = useState<Record<string, string>>({});
  const hasArcaneCannon = (ship.systems['arcane-cannon'] ?? 0) > 0;
  const gunnerSpells = ship.crewMembers?.gunner?.megaSpells ?? [];

  const setResult = (key: string, value: string) => {
    setResults((prev) => ({ ...prev, [key]: value }));
  };

  const rollSkill = (action: CrewActionDef) => {
    const r = rollD20(skillModifier);
    const dc = action.dc != null ? ` vs DC ${action.dc}` : '';
    const pass =
      action.dc != null
        ? r.total >= action.dc
          ? ' — SUCCESS'
          : ' — FAIL'
        : '';
    setResult(action.id, `${r.label} = ${r.total} (rolled ${r.rolls[0]})${dc}${pass}`);
  };

  const rollContested = (action: CrewActionDef) => {
    const r = rollD20(skillModifier);
    setResult(
      action.id,
      `${action.skillLabel}: ${r.total} (rolled ${r.rolls[0]}) — contested vs opposing pilot`,
    );
  };

  const rollActionDice = (action: CrewActionDef) => {
    const notation =
      action.id === 'pilot-ram' ? ramDamageDice(ship.size) : (action.dice ?? '1d6');
    const parsed = parseDamageDice(notation);
    if (!parsed) {
      setResult(action.id, 'Unable to parse dice.');
      return;
    }
    const r = rollDice(parsed.count, parsed.sides, 0, notation);
    setResult(action.id, `${notation}: [${r.rolls.join(', ')}] = ${r.total} mega damage`);
  };

  const rollDisadvantageAttack = (action: CrewActionDef) => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const roll = Math.min(a, b);
    const total = roll + attackBonus;
    setResult(
      action.id,
      `Disadvantage: rolled ${a} & ${b} (used ${roll}) + ${attackBonus} = ${total}`,
    );
  };

  return (
    <li className="text-slate-200 panel p-3">
      {portraitUrl && (
        <img
          src={portraitUrl}
          alt={memberName ? `${memberName} portrait` : `${roleLabel} portrait`}
          className="media-clean float-right ml-3 mb-2 w-24 sm:w-28 aspect-square object-cover rounded-sm border border-cyan/35 shadow-[0_0_16px_rgba(0,229,255,0.25)]"
        />
      )}
      <div className="min-w-0 space-y-2">
        <div className="font-display text-cyan text-xs tracking-wide">
          {roleLabel}
          {memberName ? ` — ${memberName}` : ''}
        </div>

        <ul className="space-y-2">
        {actions.map((action) => {
          const avail = isActionAvailable(action, ship);
          return (
            <li key={action.id} className={!avail.ok ? 'opacity-50' : ''}>
              <p className="text-slate-300 text-xs font-display tracking-wide">{action.name}</p>
              <p className="text-slate-500 text-[11px] leading-relaxed">{action.description}</p>
              {!avail.ok && (
                <p className="text-danger/70 text-[10px] mt-0.5">{avail.reason}</p>
              )}

              {avail.ok && action.type === 'skillCheck' && (
                <div className="mt-1 no-print">
                  <button
                    type="button"
                    className="btn !py-1 !px-2 !text-[10px]"
                    onClick={() => rollSkill(action)}
                  >
                    🎲 Roll {action.skillLabel}
                    {action.dc != null ? ` (DC ${action.dc})` : ''}
                  </button>
                  {results[action.id] && (
                    <p className="text-cyan text-[11px] mt-1">{results[action.id]}</p>
                  )}
                </div>
              )}

              {avail.ok && action.type === 'contestedCheck' && (
                <div className="mt-1 no-print">
                  <button
                    type="button"
                    className="btn !py-1 !px-2 !text-[10px]"
                    onClick={() => rollContested(action)}
                  >
                    🎲 Roll {action.skillLabel}
                  </button>
                  {results[action.id] && (
                    <p className="text-cyan text-[11px] mt-1">{results[action.id]}</p>
                  )}
                </div>
              )}

              {avail.ok && action.type === 'diceRoll' && (
                <div className="mt-1 no-print">
                  <button
                    type="button"
                    className="btn btn-amber !py-1 !px-2 !text-[10px]"
                    onClick={() => rollActionDice(action)}
                  >
                    🎲 Roll{' '}
                    {action.id === 'pilot-ram' ? ramDamageDice(ship.size) : action.dice}
                  </button>
                  {results[action.id] && (
                    <p className="text-amber text-[11px] mt-1">{results[action.id]}</p>
                  )}
                </div>
              )}

              {avail.ok && action.type === 'attackDisadvantage' && (
                <div className="mt-1 no-print">
                  <button
                    type="button"
                    className="btn !py-1 !px-2 !text-[10px]"
                    onClick={() => rollDisadvantageAttack(action)}
                  >
                    🎲 Roll Attack (disadvantage)
                  </button>
                  {results[action.id] && (
                    <p className="text-cyan text-[11px] mt-1">{results[action.id]}</p>
                  )}
                </div>
              )}
            </li>
          );
        })}

        {roleId === 'gunner' && ship.weapons.length > 0 && (
          <li>
            <p className="text-slate-300 text-xs font-display tracking-wide mt-1">
              Mounted Weapons
            </p>
            <ul className="space-y-2 mt-1">
              {ship.weapons.map((w, i) => {
                const def = WEAPONS_BY_NAME[w.name];
                if (!def) return null;
                const atkKey = `weapon-atk-${i}`;
                const dmgKey = `weapon-dmg-${i}`;
                return (
                  <li key={i} className="text-[11px]">
                    <p className="text-slate-400">
                      {def.name}{' '}
                      <span className="text-amber">[{w.facing}]</span> — {def.damage}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1 no-print">
                      <button
                        type="button"
                        className="btn !py-1 !px-2 !text-[10px]"
                        onClick={() => {
                          const r = rollD20(attackBonus);
                          const nat = r.rolls[0];
                          const crit =
                            nat === 20 ? ' CRIT!' : nat === 1 ? ' FUMBLE!' : '';
                          setResult(
                            atkKey,
                            `${r.label} = ${r.total} (rolled ${nat})${crit}`,
                          );
                        }}
                      >
                        🎲 Attack
                      </button>
                      <button
                        type="button"
                        className="btn btn-amber !py-1 !px-2 !text-[10px]"
                        onClick={() => {
                          const r = rollWeaponDamage(def.damage);
                          setResult(
                            dmgKey,
                            r
                              ? `${r.label}: [${r.rolls.join(', ')}] = ${r.total}`
                              : 'No dice to roll.',
                          );
                        }}
                      >
                        🎲 Damage
                      </button>
                    </div>
                    {results[atkKey] && (
                      <p className="text-cyan text-[11px] mt-1">
                        <span className="text-slate-500">{def.name} attack:</span>{' '}
                        {results[atkKey]}
                      </p>
                    )}
                    {results[dmgKey] && (
                      <p className="text-amber text-[11px] mt-0.5">
                        <span className="text-slate-500">{def.name} damage:</span>{' '}
                        {results[dmgKey]}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        )}

        {roleId === 'gunner' && gunnerSpells.length > 0 && !hasArcaneCannon && (
          <li>
            <p className="text-slate-500 text-[11px]">
              Mega spells selected — install an Arcane Cannon to use them in combat.
            </p>
          </li>
        )}

        {roleId === 'gunner' && hasArcaneCannon && gunnerSpells.length > 0 && (
          <li>
            <p className="text-slate-300 text-xs font-display tracking-wide mt-1">
              Mega Spells (Arcane Cannon)
            </p>
            <ul className="space-y-2 mt-1">
              {gunnerSpells.map((spellId) => {
                const spell = MEGA_SPELLS_BY_ID[spellId];
                if (!spell) return null;
                const atkKey = `spell-atk-${spellId}`;
                const dmgKey = `spell-dmg-${spellId}`;
                return (
                  <li key={spellId} className="text-[11px]">
                    <p className="text-fuchsia-400">
                      ✦ {spell.name} (level {spell.level}) — {spell.damage}
                    </p>
                    <p className="text-slate-500 text-[10px]">{spell.description}</p>
                    {spell.save && (
                      <p className="text-slate-500 text-[10px]">
                        Save: {spell.save} ({spell.saveEffect ?? 'see spell'})
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-1 no-print">
                      <button
                        type="button"
                        className="btn !py-1 !px-2 !text-[10px]"
                        onClick={() => {
                          const r = rollD20(attackBonus);
                          setResult(atkKey, `Spell attack ${r.total} (rolled ${r.rolls[0]})`);
                        }}
                      >
                        🎲 Spell Attack
                      </button>
                      <button
                        type="button"
                        className="btn btn-amber !py-1 !px-2 !text-[10px]"
                        onClick={() => {
                          const r = rollWeaponDamage(spell.damage);
                          setResult(
                            dmgKey,
                            r
                              ? `${r.label}: [${r.rolls.join(', ')}] = ${r.total}`
                              : 'No dice to roll.',
                          );
                        }}
                      >
                        🎲 Mega Damage
                      </button>
                    </div>
                    {results[atkKey] && (
                      <p className="text-cyan text-[11px] mt-1">
                        <span className="text-slate-500">{spell.name} attack:</span>{' '}
                        {results[atkKey]}
                      </p>
                    )}
                    {results[dmgKey] && (
                      <p className="text-amber text-[11px] mt-0.5">
                        <span className="text-slate-500">{spell.name} damage:</span>{' '}
                        {results[dmgKey]}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        )}
      </ul>
      </div>
    </li>
  );
}

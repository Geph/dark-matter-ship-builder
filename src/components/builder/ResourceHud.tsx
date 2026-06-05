import type { Ship } from '../../lib/types';
import { budgetForLevel, computeCreditsSpent, slotsUsed } from '../../lib/rules';

// Persistent HUD bar showing live Credits budget and slot usage.
export default function ResourceHud({ ship }: { ship: Ship }) {
  const budget = budgetForLevel(ship.level, ship.players);
  const spent = computeCreditsSpent(ship);
  const remaining = budget - spent;
  const used = slotsUsed(ship);
  const overBudget = remaining < 0;
  const overSlots = used > ship.totalSlots;

  const creditPct = Math.min(100, (spent / budget) * 100);
  const slotPct = Math.min(100, (used / ship.totalSlots) * 100);

  return (
    <div className="panel p-4 space-y-4 sticky top-20">
      {/* Credits */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-display text-[11px] tracking-widest text-slate-300">
            CREDITS
          </span>
          <span
            className={`font-mono-hud text-sm ${overBudget ? 'text-danger' : 'text-amber'} glow-amber`}
          >
            {remaining.toLocaleString()} CR
          </span>
        </div>
        <div className="hud-bar">
          <span
            style={{ width: `${creditPct}%` }}
            className={overBudget ? 'bg-danger' : 'bg-amber'}
          />
        </div>
        <div className="flex justify-between mt-1 font-mono-hud text-[10px] text-slate-500">
          <span>SPENT {spent.toLocaleString()}</span>
          <span>BUDGET {budget.toLocaleString()}</span>
        </div>
        {overBudget && (
          <p className="text-danger text-[11px] mt-1 font-mono-hud">
            ⚠ OVER BUDGET — remove components
          </p>
        )}
      </div>

      {/* Slots */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-display text-[11px] tracking-widest text-slate-300">
            SLOTS
          </span>
          <span
            className={`font-mono-hud text-sm ${overSlots ? 'text-danger' : 'text-cyan'} glow-text`}
          >
            {used}/{ship.totalSlots}
          </span>
        </div>
        <div className="hud-bar">
          <span
            style={{ width: `${slotPct}%` }}
            className={overSlots ? 'bg-danger' : 'bg-cyan'}
          />
        </div>
        {overSlots && (
          <p className="text-danger text-[11px] mt-1 font-mono-hud">
            ⚠ NO FREE SLOTS — uninstall to add more
          </p>
        )}
      </div>

      <p className="text-[10px] text-slate-500 font-mono-hud leading-relaxed pt-1 border-t border-slate-700/60">
        Leftover Credits cannot be saved after the build is complete.
      </p>
    </div>
  );
}

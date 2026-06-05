import { useState } from 'react';
import type { Ship } from '../../lib/types';
import {
  budgetForLevel,
  computeCreditsSpent,
  effectiveBudget,
  slotsUsed,
} from '../../lib/rules';

interface Props {
  ship: Ship;
  update: (mutator: (s: Ship) => Ship) => void;
}

// Persistent HUD bar showing live Credits budget and slot usage.
export default function ResourceHud({ ship, update }: Props) {
  const calculated = budgetForLevel(ship.level, ship.players);
  const budget = effectiveBudget(ship);
  const spent = computeCreditsSpent(ship);
  const remaining = budget - spent;
  const used = slotsUsed(ship);
  const overBudget = remaining < 0;
  const overSlots = used > ship.totalSlots;
  const isOverridden = ship.creditBudgetOverride != null;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [showGmWarning, setShowGmWarning] = useState(false);
  const [pendingOverride, setPendingOverride] = useState<number | null>(null);

  const creditPct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const slotPct = Math.min(100, (used / ship.totalSlots) * 100);

  const beginEdit = () => {
    setDraft(String(budget));
    setEditing(true);
  };

  const requestApply = () => {
    const parsed = Number(draft.replace(/,/g, ''));
    if (!Number.isFinite(parsed) || parsed < 0) return;
    if (parsed === calculated && isOverridden) {
      update((s) => ({ ...s, creditBudgetOverride: null }));
      setEditing(false);
      return;
    }
    if (parsed === calculated && !isOverridden) {
      setEditing(false);
      return;
    }
    setPendingOverride(parsed);
    setShowGmWarning(true);
  };

  const confirmOverride = () => {
    if (pendingOverride != null) {
      update((s) => ({ ...s, creditBudgetOverride: pendingOverride }));
    }
    setShowGmWarning(false);
    setPendingOverride(null);
    setEditing(false);
  };

  const cancelOverride = () => {
    setShowGmWarning(false);
    setPendingOverride(null);
  };

  const resetToCalculated = () => {
    update((s) => ({ ...s, creditBudgetOverride: null }));
    setEditing(false);
  };

  return (
    <>
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
            {editing ? (
              <span className="text-cyan">editing budget…</span>
            ) : (
              <button
                type="button"
                onClick={beginEdit}
                className="text-slate-400 hover:text-cyan transition-colors"
                title="Manually set credit budget (requires GM permission)"
              >
                BUDGET {budget.toLocaleString()}
                {isOverridden && <span className="text-amber ml-1">*</span>}
              </button>
            )}
          </div>
          {editing && (
            <div className="mt-2 space-y-2">
              <input
                type="number"
                min={0}
                step={50}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full bg-void border border-cyan/50 rounded-sm px-2 py-1 font-mono-hud text-sm text-cyan"
                aria-label="Credit budget"
              />
              <div className="flex gap-1 flex-wrap">
                <button type="button" className="btn btn-solid !px-2 !py-0.5 text-[10px]" onClick={requestApply}>
                  Apply
                </button>
                <button
                  type="button"
                  className="btn !px-2 !py-0.5 text-[10px]"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                {isOverridden && (
                  <button
                    type="button"
                    className="btn !px-2 !py-0.5 text-[10px] text-ok"
                    onClick={resetToCalculated}
                  >
                    Reset ({calculated.toLocaleString()})
                  </button>
                )}
              </div>
              <p className="font-mono-hud text-[9px] text-slate-500">
                Calculated budget: {calculated.toLocaleString()} CR (Lv {ship.level} × {ship.players}{' '}
                player{ship.players !== 1 ? 's' : ''})
              </p>
            </div>
          )}
          {isOverridden && !editing && (
            <p className="text-amber/90 text-[10px] mt-1 font-mono-hud">
              * GM-approved manual budget (calculated: {calculated.toLocaleString()} CR)
            </p>
          )}
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

      {showGmWarning && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gm-permission-title"
        >
          <div className="panel panel-corner max-w-md w-full p-5 space-y-4 border-amber/60 shadow-[0_0_24px_#ffb30044]">
            <h3
              id="gm-permission-title"
              className="font-display text-lg text-amber tracking-wider"
            >
              GM Permission Required
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              You are about to manually change the credit budget to{' '}
              <span className="text-cyan font-mono-hud">
                {pendingOverride?.toLocaleString()} CR
              </span>
              . Did your Game Master give you permission to modify credits for this build?
            </p>
            <p className="text-slate-500 text-xs font-mono-hud">
              Only confirm if your GM explicitly approved this override.
            </p>
            <div className="flex gap-2 justify-end pt-1">
              <button type="button" className="btn" onClick={cancelOverride}>
                No — Cancel
              </button>
              <button type="button" className="btn btn-amber" onClick={confirmOverride}>
                Yes — GM Approved
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

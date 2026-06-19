import { useEffect, useState } from 'react';
import type { Ship } from '../lib/types';
import {
  defaultPrintOptions,
  hasPrintSelection,
  type PrintOptions,
} from '../lib/useShipPrint';
import { CREW_ROLES_BY_ID } from '../data/crewRoles';

interface Props {
  open: boolean;
  ship: Ship;
  onCancel: () => void;
  onConfirm: (options: PrintOptions) => void;
}

export default function PrintOptionsDialog({ open, ship, onCancel, onConfirm }: Props) {
  const [options, setOptions] = useState<PrintOptions>(() => defaultPrintOptions(ship));

  const hasImage = !!ship.shipImageDataUrl;
  const hasCrewActions = ship.crewRoles.some((id) => CREW_ROLES_BY_ID[id]);

  useEffect(() => {
    if (open) setOptions(defaultPrintOptions(ship));
  }, [open, ship]);

  if (!open) return null;

  const toggle = (key: keyof PrintOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="no-print fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-options-title"
    >
      <div className="panel max-w-md w-full p-5 space-y-4 border-cyan/40 shadow-[0_0_32px_#00e5ff33]">
        <div>
          <h2
            id="print-options-title"
            className="font-display text-lg text-cyan glow-text tracking-wider"
          >
            Print Options
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Choose what to include in the printout. The ship portrait prints on its own page.
          </p>
        </div>

        <fieldset className="space-y-3 border-0 p-0">
          <legend className="sr-only">Print sections</legend>

          <label
            className={`flex items-start gap-3 panel p-3 cursor-pointer ${
              !hasImage ? 'opacity-50 cursor-not-allowed' : 'hover:border-cyan/50'
            }`}
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={options.shipImage}
              disabled={!hasImage}
              onChange={() => toggle('shipImage')}
            />
            <span>
              <span className="font-display text-sm text-cyan block">Ship image</span>
              <span className="text-slate-500 text-xs font-mono-hud">
                {hasImage
                  ? 'Full-page portrait on the first sheet'
                  : 'No ship portrait uploaded'}
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 panel p-3 cursor-pointer hover:border-cyan/50">
            <input
              type="checkbox"
              className="mt-1"
              checked={options.shipStats}
              onChange={() => toggle('shipStats')}
            />
            <span>
              <span className="font-display text-sm text-cyan block">Ship stats</span>
              <span className="text-slate-500 text-xs font-mono-hud">
                Stat block, systems, weapons, upgrades, and description
              </span>
            </span>
          </label>

          <label
            className={`flex items-start gap-3 panel p-3 cursor-pointer ${
              !hasCrewActions ? 'opacity-50 cursor-not-allowed' : 'hover:border-cyan/50'
            }`}
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={options.crewActions}
              disabled={!hasCrewActions}
              onChange={() => toggle('crewActions')}
            />
            <span>
              <span className="font-display text-sm text-cyan block">Crew actions</span>
              <span className="text-slate-500 text-xs font-mono-hud">
                {hasCrewActions
                  ? 'Reference list of role actions and mounted weapons'
                  : 'No crew roles assigned'}
              </span>
            </span>
          </label>
        </fieldset>

        <div className="flex flex-wrap gap-2 justify-end pt-1">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-solid"
            disabled={!hasPrintSelection(options)}
            onClick={() => onConfirm(options)}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

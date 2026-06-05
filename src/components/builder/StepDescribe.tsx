import { useState } from 'react';
import type { Ship } from '../../lib/types';
import {
  APPEARANCE_TABLE,
  CONDITION_TABLE,
  INTERIOR_TABLE,
  UNIQUE_TABLE,
  rollFlavor,
  type FlavorTable,
} from '../../data/flavorTables';

interface Props {
  ship: Ship;
  update: (mutator: (s: Ship) => Ship) => void;
}

type FieldKey = 'appearance' | 'condition' | 'interior' | 'uniqueTrait';

const SECTIONS: { table: FlavorTable; field: FieldKey }[] = [
  { table: APPEARANCE_TABLE, field: 'appearance' },
  { table: CONDITION_TABLE, field: 'condition' },
  { table: INTERIOR_TABLE, field: 'interior' },
  { table: UNIQUE_TABLE, field: 'uniqueTrait' },
];

export default function StepDescribe({ ship, update }: Props) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-xl text-cyan glow-text tracking-wider">
          STEP 2 · HULL SCAN
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Roll on the description tables, pick an entry, or write your own. These are
          pure flavor — no cost, no slots.
        </p>
      </header>

      {SECTIONS.map(({ table, field }) => (
        <FlavorSection
          key={table.id}
          table={table}
          value={ship[field]}
          onChange={(text) => update((s) => ({ ...s, [field]: text }))}
        />
      ))}
    </div>
  );
}

function FlavorSection({
  table,
  value,
  onChange,
}: {
  table: FlavorTable;
  value: string;
  onChange: (text: string) => void;
}) {
  const [flash, setFlash] = useState(false);

  const roll = () => {
    onChange(rollFlavor(table));
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
  };

  return (
    <div className={`panel p-4 ${flash ? 'roll-flash' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm text-amber tracking-wide">{table.title}</h3>
        <button type="button" className="btn btn-amber !py-1 !px-3" onClick={roll}>
          ⚄ Roll d100
        </button>
      </div>

      <select
        value=""
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="w-full mb-2 text-sm"
      >
        <option value="">— pick an entry —</option>
        {table.entries.map((entry) => (
          <option key={entry.min} value={entry.text}>
            {entry.min === entry.max ? entry.min : `${entry.min}–${entry.max}`}: {entry.text.slice(0, 70)}
            {entry.text.length > 70 ? '…' : ''}
          </option>
        ))}
      </select>

      <textarea
        rows={2}
        value={value}
        placeholder="Roll, pick, or type a custom description…"
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm"
      />
    </div>
  );
}

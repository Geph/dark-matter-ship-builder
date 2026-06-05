const STEPS = ['CREW MANIFEST', 'HULL SCAN', 'LOADOUT', 'DESIGNATION'];

export default function WizardProgress({
  step,
  onJump,
}: {
  step: number; // 0-indexed
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onJump(i)}
              className="flex items-center gap-2 group"
            >
              <span
                className={`w-7 h-7 rounded-full border flex items-center justify-center font-display text-xs transition-all ${
                  active
                    ? 'border-cyan text-cyan bg-cyan/15 shadow-[0_0_14px_#00e5ff]'
                    : done
                      ? 'border-ok text-ok'
                      : 'border-slate-600 text-slate-500'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={`font-display text-[10px] sm:text-xs tracking-widest hidden sm:inline ${
                  active ? 'text-cyan glow-text' : done ? 'text-ok' : 'text-slate-500'
                }`}
              >
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span
                className={`h-px w-5 sm:w-10 ${i < step ? 'bg-ok' : 'bg-slate-700'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

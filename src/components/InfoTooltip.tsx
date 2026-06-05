interface Props {
  text: string;
}

/** Hover info icon with explanation tooltip for loadout items. */
export default function InfoTooltip({ text }: Props) {
  return (
    <span className="relative inline-flex align-middle group z-20">
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-slate-500 text-slate-400 text-[10px] font-mono-hud cursor-help hover:border-amber hover:text-amber transition-colors"
        aria-label="More information"
      >
        i
      </span>
      <span
        role="tooltip"
        className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-56 max-w-[70vw] p-2.5 bg-void-2 border border-amber/40 text-slate-300 text-[11px] leading-relaxed rounded-sm shadow-[0_0_12px_rgba(0,0,0,0.6)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity pointer-events-none"
      >
        {text}
      </span>
    </span>
  );
}

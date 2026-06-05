import { Link } from 'react-router-dom';
import SpaceshipIcon from '../components/SpaceshipIcon';

const FEATURES = [
  {
    step: 1,
    title: 'CREW MANIFEST',
    body: 'Pick party level and roles. Crew systems install themselves automatically.',
    color: 'text-amber glow-amber',
  },
  {
    step: 2,
    title: 'HULL SCAN',
    body: 'Roll d100 on the official appearance, condition, interior, and quirk tables.',
    color: 'text-ok [text-shadow:0_0_8px_rgba(56,255,156,0.7)]',
  },
  {
    step: 3,
    title: 'LIVE LOADOUT',
    body: 'Spend Credits on systems, weapons, and upgrades with slot & budget tracking.',
    color: 'text-orange-400 [text-shadow:0_0_8px_rgba(251,146,60,0.7)]',
  },
  {
    step: 4,
    title: 'CONFIG SCHEMATIC',
    body: 'Mount weapons to fore, aft, port, starboard, and turret arcs on a visual hull.',
    color: 'text-fuchsia-400 [text-shadow:0_0_8px_rgba(232,121,249,0.7)]',
  },
] as const;

export default function Landing() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-5">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-cyan flex items-center justify-center text-cyan shadow-[0_0_20px_#00e5ff55]">
          <SpaceshipIcon className="w-18 h-18 sm:w-22 sm:h-22" />
        </div>
      </div>
      <p className="font-mono-hud text-amber tracking-[0.4em] text-xs mb-4">
        DARK MATTER · SCI-FI 5E
      </p>
      <h1 className="font-display text-4xl sm:text-6xl text-cyan glow-text tracking-wider">
        SHIP BUILDER
      </h1>
      <p className="text-slate-300 max-w-xl mx-auto mt-5 leading-relaxed">
        Forge a starship from the void. Follow the four-step creation flow, balance
        your Credits and hardpoint slots, and christen a vessel ready for the
        &lsquo;Verse.
      </p>

      <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
        <Link to="/build" className="btn btn-solid !py-3 !px-8 text-base">
          ⛬ Build a Ship
        </Link>
        <Link to="/ships" className="btn !py-3 !px-8 text-base">
          ▣ My Ships
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 text-left">
        {FEATURES.map((f) => (
          <div key={f.title} className="panel panel-corner p-4">
            <p className={`font-display text-3xl leading-none mb-2 ${f.color}`}>
              {String(f.step).padStart(2, '0')}
            </p>
            <h3 className={`font-display text-sm tracking-widest mb-2 ${f.color}`}>
              {f.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>

      <p className="font-mono-hud text-[10px] text-slate-600 mt-16 tracking-widest">
        Rules sourced from Dark Matter Sci-Fi 5E (pp. 206–220) · Mage Hand Press
      </p>
    </div>
  );
}

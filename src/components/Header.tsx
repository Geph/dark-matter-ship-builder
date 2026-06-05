import { Link, useLocation } from 'react-router-dom';
import SpaceshipIcon from './SpaceshipIcon';

export default function Header() {
  const { pathname } = useLocation();

  const navItem = (to: string, label: string) => {
    const active = pathname === to || (to !== '/' && pathname.startsWith(to));
    return (
      <Link
        to={to}
        className={`font-display text-xs tracking-widest uppercase px-3 py-2 transition-colors ${
          active ? 'text-cyan glow-text' : 'text-slate-400 hover:text-cyan'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="no-print sticky top-0 z-50 border-b border-cyan/25 backdrop-blur-sm bg-[#0a0c14]/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full border border-cyan flex items-center justify-center text-cyan group-hover:shadow-[0_0_14px_#00e5ff] transition-shadow">
            <SpaceshipIcon className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-cyan text-sm tracking-[0.2em] glow-text">
              DARK&nbsp;MATTER
            </div>
            <div className="font-mono-hud text-[10px] text-amber tracking-[0.3em]">
              SHIP&nbsp;BUILDER
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {navItem('/', 'Home')}
          {navItem('/build', 'Build')}
          {navItem('/ships', 'My Ships')}
        </nav>
      </div>
    </header>
  );
}

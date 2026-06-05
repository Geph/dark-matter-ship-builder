import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { appVersionLabel } from './lib/version';
import Landing from './pages/Landing';
import Builder from './pages/Builder';
import MyShips from './pages/MyShips';
import PublicShip from './pages/PublicShip';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/build" element={<Builder />} />
          <Route path="/build/:id" element={<Builder />} />
          <Route path="/ships" element={<MyShips />} />
          <Route path="/ship/:token" element={<PublicShip />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      <footer className="no-print border-t border-cyan/15 py-4 px-4 text-center font-mono-hud text-[10px] text-slate-600 tracking-widest space-y-1">
        <p>DARK MATTER SHIP BUILDER · FAN-MADE TOOL · RULES © MAGE HAND PRESS</p>
        <p>
          Spaceship icon by{' '}
          <a
            href="https://game-icons.net/1x1/delapouite/spaceship.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan transition-colors"
          >
            Delapouite
          </a>{' '}
          and other icons from{' '}
          <a
            href="https://game-icons.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan transition-colors"
          >
            game-icons.net
          </a>
        </p>
        <p className="text-slate-700">{appVersionLabel()}</p>
      </footer>
    </div>
  );
}

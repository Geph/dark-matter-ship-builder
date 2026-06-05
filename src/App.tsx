import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
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
      <footer className="no-print border-t border-cyan/15 py-4 text-center font-mono-hud text-[10px] text-slate-600 tracking-widest">
        DARK MATTER SHIP BUILDER · FAN-MADE TOOL · RULES © MAGE HAND PRESS
      </footer>
    </div>
  );
}

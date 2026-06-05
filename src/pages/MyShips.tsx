import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Ship } from '../lib/types';
import { listShips, deleteShip, duplicateShip } from '../lib/storage';
import { effectiveDmClass } from '../lib/rules';

export default function MyShips() {
  const navigate = useNavigate();
  const [ships, setShips] = useState<Ship[]>(() => listShips());

  const refresh = () => setShips(listShips());

  const remove = (id: string, name: string) => {
    if (confirm(`Decommission "${name || 'Untitled'}"? This cannot be undone.`)) {
      deleteShip(id);
      refresh();
    }
  };

  const duplicate = (id: string) => {
    duplicateShip(id);
    refresh();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-cyan glow-text tracking-wider">
          MY SHIPS
        </h1>
        <Link to="/build" className="btn btn-solid">
          + New Ship
        </Link>
      </div>

      {ships.length === 0 ? (
        <div className="panel panel-corner p-10 text-center">
          <p className="text-slate-400">No ships in the registry yet.</p>
          <Link to="/build" className="btn btn-solid mt-4 inline-block">
            ⛬ Build your first ship
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {ships.map((ship) => (
            <div key={ship.id} className="panel panel-corner p-4 flex flex-col">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <Link
                    to={`/build/${ship.id}`}
                    className="font-display text-lg text-cyan glow-text hover:underline break-words"
                  >
                    {ship.name || 'Untitled Vessel'}
                  </Link>
                  <p className="font-mono-hud text-[11px] text-amber mt-1 tracking-wide">
                    {ship.size} · LVL {ship.level} · DM {effectiveDmClass(ship)}
                  </p>
                </div>
                <span className="font-mono-hud text-[10px] text-slate-500 shrink-0">
                  {ship.totalSlots} slots
                </span>
              </div>

              <p className="font-mono-hud text-[10px] text-slate-500 mt-2">
                Edited {new Date(ship.updatedAt).toLocaleString()}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-700/60">
                <button className="btn !py-1 !px-3" onClick={() => navigate(`/build/${ship.id}`)}>
                  Edit
                </button>
                <button className="btn !py-1 !px-3" onClick={() => navigate(`/ship/${ship.shareToken}`)}>
                  View
                </button>
                <button className="btn btn-amber !py-1 !px-3" onClick={() => duplicate(ship.id)}>
                  Duplicate
                </button>
                <button
                  className="btn btn-danger !py-1 !px-3"
                  onClick={() => remove(ship.id, ship.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

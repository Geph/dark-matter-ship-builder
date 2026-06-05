import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Ship } from '../lib/types';
import {
  listShips,
  deleteShip,
  duplicateShip,
  saveShip,
  importShips,
} from '../lib/storage';
import { effectiveDmClass } from '../lib/rules';
import { downloadShipExport, parseShipImportFile } from '../lib/shipTransfer';
import ShipIcon from '../components/ShipIcon';
import ShipIconPicker from '../components/ShipIconPicker';

export default function MyShips() {
  const navigate = useNavigate();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [ships, setShips] = useState<Ship[]>(() => listShips());
  const [emblemEditId, setEmblemEditId] = useState<string | null>(null);

  const refresh = () => setShips(listShips());

  const remove = (id: string, name: string) => {
    if (confirm(`Decommission "${name || 'Untitled'}"? This cannot be undone.`)) {
      deleteShip(id);
      if (emblemEditId === id) setEmblemEditId(null);
      refresh();
    }
  };

  const duplicate = (id: string) => {
    duplicateShip(id);
    refresh();
  };

  const setEmblem = (ship: Ship, iconId: string | null) => {
    saveShip({ ...ship, iconId });
    setEmblemEditId(null);
    refresh();
  };

  const exportShips = (targets: Ship[]) => {
    downloadShipExport(targets);
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseShipImportFile(text);
      const count = importShips(parsed);
      refresh();
      alert(`Imported ${count} ship${count === 1 ? '' : 's'} into the registry.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import failed.';
      alert(message);
    } finally {
      if (importInputRef.current) importInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleImport(file);
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl text-cyan glow-text tracking-wider">
          MY SHIPS
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => importInputRef.current?.click()}
          >
            ⬇ Import
          </button>
          {ships.length > 0 && (
            <button type="button" className="btn" onClick={() => exportShips(ships)}>
              ⬆ Export Fleet
            </button>
          )}
          <Link to="/build" className="btn btn-solid">
            + New Ship
          </Link>
        </div>
      </div>

      {ships.length === 0 ? (
        <div className="panel panel-corner p-10 text-center">
          <p className="text-slate-400">No ships in the registry yet.</p>
          <p className="text-slate-500 text-sm mt-2">
            Build a new ship or import a `.json` export from another device.
          </p>
          <Link to="/build" className="btn btn-solid mt-4 inline-block">
            ⛬ Build your first ship
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {ships.map((ship) => (
            <div key={ship.id} className="panel panel-corner p-4 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEmblemEditId((id) => (id === ship.id ? null : ship.id))
                  }
                  className={`shrink-0 rounded-sm border p-1 transition-all hover:border-cyan/60 ${
                    emblemEditId === ship.id ? 'border-cyan bg-cyan/10' : 'border-slate-700'
                  }`}
                  title="Choose registry emblem"
                >
                  {ship.iconId ? (
                    <ShipIcon iconId={ship.iconId} className="w-10 h-10" alt="" />
                  ) : (
                    <span className="w-10 h-10 flex items-center justify-center font-mono-hud text-[9px] text-slate-500">
                      + emblem
                    </span>
                  )}
                </button>
                <div className="min-w-0 flex-1">
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

              {emblemEditId === ship.id && (
                <div className="mt-3 pt-3 border-t border-slate-700/60">
                  <ShipIconPicker
                    value={ship.iconId}
                    onChange={(iconId) => setEmblem(ship, iconId)}
                  />
                </div>
              )}

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
                  type="button"
                  className="btn !py-1 !px-3"
                  onClick={() => exportShips([ship])}
                >
                  Export
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

import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Ship } from '../lib/types';
import { getShipByShareToken, saveShip } from '../lib/storage';
import { shipShareUrl } from '../lib/shareUrl';
import { canShareShipLinks } from '../lib/sharing';
import { useShipPrint } from '../lib/useShipPrint';
import StatBlock from '../components/StatBlock';
import CrewActionTabs from '../components/CrewActionTabs';
import CrewActionsPrint from '../components/CrewActionsPrint';

export default function PublicShip() {
  const { token } = useParams();
  const [ship, setShip] = useState<Ship | undefined>(() =>
    token ? getShipByShareToken(token) : undefined,
  );
  const [shared, setShared] = useState(false);
  const { printWithCrewActions, requestPrint } = useShipPrint();
  const showShare = canShareShipLinks();

  const update = useCallback((mutator: (s: Ship) => Ship) => {
    setShip((prev) => {
      if (!prev) return prev;
      const saved = saveShip(mutator(prev));
      return saved;
    });
  }, []);

  if (!ship) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-danger glow-text">SIGNAL LOST</h1>
        <p className="text-slate-400 mt-3">
          No ship found for this link. It may only exist in another browser's local
          registry.
        </p>
        <Link to="/" className="btn btn-solid mt-6 inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(shipShareUrl(ship.shareToken));
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="no-print flex items-center justify-between mb-5">
        <p className="font-mono-hud text-[11px] text-amber tracking-widest">
          SHIP SHEET
        </p>
        <div className="flex gap-2">
          {showShare && (
            <button className="btn" onClick={share}>
              {shared ? '✓ Link Copied' : '🔗 Share'}
            </button>
          )}
          <button className="btn" onClick={requestPrint}>
            ⎙ Print
          </button>
        </div>
      </div>

      {ship.shipImageDataUrl && (
        <div className="mb-6 panel panel-corner p-3 sm:p-4 flex justify-center bg-void/40">
          <img
            src={ship.shipImageDataUrl}
            alt={ship.name ? `${ship.name} portrait` : 'Ship portrait'}
            className="max-h-72 sm:max-h-96 w-full object-contain rounded-sm"
          />
        </div>
      )}

      <div className="space-y-6">
        <StatBlock ship={ship} hideCrewActions onUpdate={update} />

        {printWithCrewActions && <CrewActionsPrint ship={ship} />}

        <div className="no-print">
          <h3 className="font-display text-xs tracking-[0.25em] text-amber mb-3">
            CREW ACTIONS
          </h3>
          <CrewActionTabs ship={ship} />
        </div>
      </div>
    </div>
  );
}

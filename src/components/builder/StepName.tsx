import { useState } from 'react';
import type { Ship } from '../../lib/types';
import { randomShipName } from '../../data/shipNames';
import { shipToText } from '../../lib/exportText';
import { shipShareUrl } from '../../lib/shareUrl';
import { canShareShipLinks } from '../../lib/sharing';
import { useShipPrint } from '../../lib/useShipPrint';
import StatBlock from '../StatBlock';
import CrewActionsPrint from '../CrewActionsPrint';
import ShipImageUpload from '../ShipImageUpload';

interface Props {
  ship: Ship;
  update: (mutator: (s: Ship) => Ship) => void;
  onSave: () => void;
  savedAt: string | null;
}

export default function StepName({ ship, update, onSave, savedAt }: Props) {
  const [christened, setChristened] = useState(false);
  const [copied, setCopied] = useState(false);
  const { printWithCrewActions, requestPrint } = useShipPrint();
  const showShare = canShareShipLinks();

  const christen = () => {
    if (!ship.name.trim()) return;
    onSave();
    setChristened(true);
    setTimeout(() => setChristened(false), 1200);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shipToText(ship));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareUrl = shipShareUrl(ship.shareToken);

  return (
    <div className="space-y-6">
      <header className="no-print">
        <h2 className="font-display text-xl text-cyan glow-text tracking-wider">
          STEP 4 · DESIGNATION
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Name your vessel, upload a portrait for the view page, and christen it into the fleet.
        </p>
      </header>

      <div className="no-print panel p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={ship.name}
            placeholder="Enter ship designation…"
            onChange={(e) => update((s) => ({ ...s, name: e.target.value }))}
            className="flex-1 font-display tracking-wide text-lg"
          />
          <button
            type="button"
            className="btn btn-amber"
            onClick={() => update((s) => ({ ...s, name: randomShipName() }))}
          >
            ⟳ Random
          </button>
        </div>

        <ShipImageUpload
          value={ship.shipImageDataUrl}
          onChange={(shipImageDataUrl) => update((s) => ({ ...s, shipImageDataUrl }))}
        />

        <button
          type="button"
          className={`btn btn-solid w-full !py-3 ${christened ? 'roll-flash' : ''}`}
          disabled={!ship.name.trim()}
          onClick={christen}
        >
          {christened ? '✦ CHRISTENED ✦' : '⛬ CHRISTEN VESSEL'}
        </button>
        {savedAt && (
          <p className="font-mono-hud text-[11px] text-ok text-center">
            Saved to registry at {savedAt}.
            {showShare && (
              <>
                {' '}
                Share link:{' '}
                <span className="text-cyan break-all">{shareUrl}</span>
              </>
            )}
          </p>
        )}
      </div>

      {/* Export controls */}
      <div className="no-print flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={requestPrint}>
          ⎙ Print / PDF
        </button>
        <button type="button" className="btn" onClick={copy}>
          {copied ? '✓ Copied' : '⧉ Copy as Text'}
        </button>
        {showShare && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              navigator.clipboard?.writeText(shareUrl);
              setCopied(false);
            }}
          >
            🔗 Share
          </button>
        )}
      </div>

      {/* Final stat card preview */}
      <StatBlock ship={ship} showCombat crewActionsNoPrint />
      {printWithCrewActions && <CrewActionsPrint ship={ship} />}
    </div>
  );
}

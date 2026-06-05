import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getShipByShareToken } from '../lib/storage';
import { shipToText } from '../lib/exportText';
import StatBlock from '../components/StatBlock';
import ShipDiagram from '../components/ShipDiagram';

export default function PublicShip() {
  const { token } = useParams();
  const ship = token ? getShipByShareToken(token) : undefined;
  const [copied, setCopied] = useState(false);

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shipToText(ship));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="no-print flex items-center justify-between mb-5">
        <p className="font-mono-hud text-[11px] text-amber tracking-widest">
          READ-ONLY REGISTRY ENTRY
        </p>
        <div className="flex gap-2">
          <button className="btn" onClick={copy}>
            {copied ? '✓ Copied' : '⧉ Copy'}
          </button>
          <button className="btn" onClick={() => window.print()}>
            ⎙ Print
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <StatBlock ship={ship} />
        <ShipDiagram ship={ship} />
      </div>
    </div>
  );
}

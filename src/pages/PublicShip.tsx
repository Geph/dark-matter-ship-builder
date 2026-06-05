import { useCallback, useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import type { Ship } from '../lib/types';

import { getShipByShareToken, saveShip } from '../lib/storage';

import { shipToText } from '../lib/exportText';

import StatBlock from '../components/StatBlock';

import ShipDiagram from '../components/ShipDiagram';

import CrewActionTabs from '../components/CrewActionTabs';



export default function PublicShip() {

  const { token } = useParams();

  const [ship, setShip] = useState<Ship | undefined>(() =>

    token ? getShipByShareToken(token) : undefined,

  );

  const [copied, setCopied] = useState(false);



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

          SHIP SHEET

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



      {ship.shipImageDataUrl && (

        <div className="mb-6 panel panel-corner p-3 sm:p-4 flex justify-center bg-void/40">

          <img

            src={ship.shipImageDataUrl}

            alt={ship.name ? `${ship.name} portrait` : 'Ship portrait'}

            className="max-h-72 sm:max-h-96 w-full object-contain rounded-sm"

          />

        </div>

      )}



      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

        <div className="space-y-6">

          <StatBlock ship={ship} hideCrewActions onUpdate={update} />

          <div>

            <h3 className="font-display text-xs tracking-[0.25em] text-amber mb-3">

              CREW ACTIONS

            </h3>

            <CrewActionTabs ship={ship} />

          </div>

        </div>

        <ShipDiagram ship={ship} />

      </div>

    </div>

  );

}



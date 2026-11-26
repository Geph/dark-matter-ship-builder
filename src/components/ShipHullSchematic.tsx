import * as React from 'react';
import type { ShipSize, ShipWeapon } from '../lib/types';

interface Props {
  size: ShipSize;
  mhp: number;
  maxMhp: number;
  shields: number;
  maxShields: number;
  weapons: ShipWeapon[];
}

/** Health displays are telemetry, not an assertion of shield facing or system damage. */
export default function ShipHullSchematic({ size, mhp, maxMhp, shields, maxShields, weapons }: Props) {
  const id = React.useId().replace(/:/g, '');
  const integrity = maxMhp > 0 ? Math.max(0, Math.min(1, mhp / maxMhp)) : 0;
  const charge = maxShields > 0 ? Math.max(0, Math.min(1, shields / maxShields)) : 0;
  const status = mhp <= 0 ? 'HULL AT ZERO' : integrity <= 0.5 ? 'HULL CRITICAL' : integrity < 1 ? 'HULL DAMAGED' : 'HULL INTACT';
  const color = mhp <= 0 || integrity <= 0.5 ? '#fb7185' : integrity < 1 ? '#fbbf24' : '#67e8f9';
  const fighter = size === 'Fighter';
  const small = fighter || size === 'Personal';
  const transport = size === 'Transport';
  const heavy = !small && !transport;
  const capital = ['Frigate', 'Cruiser', 'Capital'].includes(size);
  const hull = small
    ? 'M125 30 L143 65 L148 127 L211 200 L213 226 L156 207 L151 276 L99 276 L94 207 L37 226 L39 200 L102 127 L107 65 Z'
    : transport
      ? 'M105 34 L145 34 L158 66 L158 111 L183 128 L183 255 L155 276 L95 276 L67 255 L67 128 L92 111 L92 66 Z'
      : 'M125 24 L150 60 L156 112 L189 131 L193 191 L211 207 L211 256 L177 270 L152 261 L148 280 L102 280 L98 261 L73 270 L39 256 L39 207 L57 191 L61 131 L94 112 L100 60 Z';
  const shieldStatus = maxShields === 0 ? 'NO SHIELDS' : shields <= 0 ? 'SHIELDS DEPLETED' : `SHIELD CHARGE ${shields}/${maxShields}`;
  return (
    <div className="absolute inset-0 flex flex-col">
      <svg viewBox="0 0 250 330" className="w-full flex-1 min-h-0" role="img" aria-label={`${size} schematic: ${status.toLowerCase()}, ${mhp}/${maxMhp} MHP; ${shieldStatus.toLowerCase()}`}>
        <title>{`${size} ship: ${status}, ${mhp}/${maxMhp} MHP; ${shieldStatus}. Shield outline shows charge, not facing. Zero MHP requires the rulebook destruction procedure.`}</title>
        <defs>
          <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#385369" /><stop offset=".45" stopColor="#142a3c" /><stop offset="1" stopColor="#07121e" />
          </linearGradient>
          <linearGradient id={`${id}-exhaust`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a5f3fc" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" /></linearGradient>
          <pattern id={`${id}-grid`} width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0 H0 V25" fill="none" stroke="#164e63" strokeWidth=".5" opacity=".45" /></pattern>
        </defs>
        <rect width="250" height="330" fill={`url(#${id}-grid)`} />
        <path d="M125 5 V20 M118 12 L125 5 L132 12" stroke="#94a3b8" fill="none" />
        <ellipse cx="125" cy="163" rx="115" ry="144" fill="none" stroke="#164e63" strokeDasharray="3 6" />
        {maxShields > 0 && <ellipse cx="125" cy="163" rx="115" ry="144" pathLength="100" fill="none" stroke={charge ? '#38bdf8' : '#64748b'} strokeWidth="2" strokeDasharray={`${charge * 100} 100`} opacity={charge ? .7 : .35} />}
        {mhp > 0 && [108, 142].map((x) => <path key={x} d={`M${x - 6} 275 L${x} ${small ? 314 : 322} L${x + 6} 275 Z`} fill={`url(#${id}-exhaust)`} opacity={integrity <= .5 ? .35 : .9} />)}
        <g stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={`url(#${id}-metal)`} opacity={mhp <= 0 ? .45 : 1}>
          <path d={hull} />
          {transport && [47, 171].map((x) => <g key={x}><rect x={x} y="123" width="32" height="133" rx="5" /><path d={`M${x} 151 h32 m-32 28 h32 m-32 28 h32 m-32 28 h32`} strokeWidth=".7" opacity=".6" /></g>)}
          {heavy && [capital ? 35 : 50, capital ? 187 : 172].map((x) => <g key={x}><path d={`M${x} 115 l14 -16 l14 16 v155 h-28 Z`} /><path d={`M${x + 5} 148 h18 m-18 22 h18 m-18 22 h18 m-18 22 h18`} strokeWidth=".6" /></g>)}
          <path d={small ? 'M114 68 L125 49 L136 68 L136 101 L114 101 Z' : 'M107 63 L125 43 L143 63 L143 83 L107 83 Z'} fill="#082f49" stroke="#7dd3fc" />
          <path d="M111 110 H139 M104 125 H146 M103 245 H147 M125 109 V135 M125 214 V254" strokeWidth=".7" opacity=".65" />
          {small && <path d="M99 161 L61 210 L94 193 M151 161 L189 210 L156 193" fill="none" opacity=".7" />}
          {capital && <path d="M88 98 L88 231 M162 98 L162 231 M100 92 H150" fill="none" strokeWidth="3" />}
          {[108, 142].map((x) => <rect key={x} x={x - 6} y="259" width="12" height="19" rx="2" fill="#082f49" />)}
        </g>
        {integrity < 1 && <g stroke="#fb923c" strokeWidth="2" fill="none"><path d="M149 204 l-13 10 l7 12 l-14 8" />{integrity <= .5 && <path d="M104 121 l15 13 l-10 12 l12 11 M165 242 l-14 -8 l4 -15" />}</g>}
        {(['Forward','Port','Starboard','Aft','Turret'] as const).map((facing) => {
          const count = weapons.filter((w) => w.facing === facing).length;
          const [x,y] = facing === 'Forward' ? [125,34] : facing === 'Aft' ? [125,280] : facing === 'Port' ? [66,195] : facing === 'Starboard' ? [184,195] : [125,165];
          return count > 0 ? <g key={facing} fill="#fbbf24" stroke="#fef3c7"><circle cx={x} cy={y} r="5" /><title>{`${facing}: ${count} mounted weapon${count === 1 ? '' : 's'}`}</title></g> : null;
        })}
        <text x="125" y="327" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={color}>{status}</text>
      </svg>
      <p className="text-center text-[10px] font-mono-hud mt-1" style={{color}}>{status}</p><p className="text-center text-[9px] font-mono-hud text-slate-400 mt-1">{shieldStatus} · charge, not facing</p>
    </div>
  );
}

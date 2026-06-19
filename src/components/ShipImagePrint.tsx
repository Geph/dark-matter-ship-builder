import type { Ship } from '../lib/types';

interface Props {
  ship: Ship;
}

/** Full-page ship portrait for printouts (own page, page break after). */
export default function ShipImagePrint({ ship }: Props) {
  if (!ship.shipImageDataUrl) return null;

  return (
    <div className="hidden print:flex print-ship-image-page flex-col items-center justify-center p-8">
      <img
        src={ship.shipImageDataUrl}
        alt={ship.name ? `${ship.name} portrait` : 'Ship portrait'}
        className="max-w-full max-h-[80vh] w-auto object-contain"
      />
      {ship.name.trim() && (
        <p className="font-display text-xl tracking-wide text-black mt-6">{ship.name}</p>
      )}
    </div>
  );
}

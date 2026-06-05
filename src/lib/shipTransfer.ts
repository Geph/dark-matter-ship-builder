import type { Ship } from './types';

export const TRANSFER_FORMAT = 'dark-matter-ship-builder';
export const TRANSFER_FORMAT_VERSION = 2;

export interface ShipExportBundle {
  format: typeof TRANSFER_FORMAT;
  formatVersion: number;
  exportedAt: string;
  ships: Ship[];
}

function slugify(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'ship';
}

export function bundleShips(ships: Ship[]): ShipExportBundle {
  return {
    format: TRANSFER_FORMAT,
    formatVersion: TRANSFER_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    ships,
  };
}

export function shipsToJson(ships: Ship[]): string {
  return JSON.stringify(bundleShips(ships), null, 2);
}

export function exportFilename(ships: Ship[]): string {
  if (ships.length === 1) {
    return `dark-matter-${slugify(ships[0].name || 'untitled')}.json`;
  }
  return `dark-matter-fleet-${ships.length}-ships.json`;
}

export function downloadShipExport(ships: Ship[]): void {
  const blob = new Blob([shipsToJson(ships)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = exportFilename(ships);
  anchor.click();
  URL.revokeObjectURL(url);
}

function isShipLike(value: unknown): value is Ship {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'size' in value
  );
}

function shipsFromJson(parsed: unknown): Ship[] {
  if (Array.isArray(parsed)) {
    return parsed.filter(isShipLike);
  }
  if (typeof parsed !== 'object' || parsed === null) return [];

  const record = parsed as Record<string, unknown>;
  if (Array.isArray(record.ships)) {
    return record.ships.filter(isShipLike);
  }
  if (isShipLike(parsed)) return [parsed];
  return [];
}

export function parseShipImportFile(text: string): Ship[] {
  const parsed: unknown = JSON.parse(text);
  const ships = shipsFromJson(parsed);
  if (ships.length === 0) {
    throw new Error('No ships found in JSON file.');
  }
  return ships;
}

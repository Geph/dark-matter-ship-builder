import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Ship } from './types';
import { CREW_ROLES_BY_ID } from '../data/crewRoles';

export interface PrintOptions {
  shipImage: boolean;
  shipStats: boolean;
  crewActions: boolean;
}

export function defaultPrintOptions(ship: Ship): PrintOptions {
  const hasCrewActions = ship.crewRoles.some((id) => CREW_ROLES_BY_ID[id]);
  return {
    shipImage: !!ship.shipImageDataUrl,
    shipStats: true,
    crewActions: hasCrewActions,
  };
}

export function hasPrintSelection(options: PrintOptions): boolean {
  return options.shipImage || options.shipStats || options.crewActions;
}

export function useShipPrint() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    shipImage: false,
    shipStats: true,
    crewActions: false,
  });
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const reset = () => setIsPrinting(false);
    window.addEventListener('afterprint', reset);
    return () => window.removeEventListener('afterprint', reset);
  }, []);

  const requestPrint = () => setDialogOpen(true);

  const cancelPrint = () => setDialogOpen(false);

  const confirmPrint = (options: PrintOptions) => {
    if (!hasPrintSelection(options)) return;
    setDialogOpen(false);
    flushSync(() => {
      setPrintOptions(options);
      setIsPrinting(true);
    });
    window.print();
  };

  return {
    dialogOpen,
    setDialogOpen,
    printOptions,
    isPrinting,
    requestPrint,
    cancelPrint,
    confirmPrint,
  };
}

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const PRINT_CREW_CONFIRM =
  'Include crew actions at the end of the printout?\n\n' +
  'Choose OK to append crew actions after the ship stats and description.\n' +
  'Choose Cancel for stats and description only.';

export function useShipPrint() {
  const [printWithCrewActions, setPrintWithCrewActions] = useState(false);

  useEffect(() => {
    const reset = () => setPrintWithCrewActions(false);
    window.addEventListener('afterprint', reset);
    return () => window.removeEventListener('afterprint', reset);
  }, []);

  const requestPrint = () => {
    const include = window.confirm(PRINT_CREW_CONFIRM);
    flushSync(() => setPrintWithCrewActions(include));
    window.print();
  };

  return { printWithCrewActions, requestPrint };
}

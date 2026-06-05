/** True when Supabase (or similar) env vars are configured for shared storage. */
export function usesDatabaseStorage(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url?.trim() && key?.trim());
}

/** True on a production build served outside localhost. */
export function isPubliclyHosted(): boolean {
  if (!import.meta.env.PROD) return false;
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1' && host !== '[::1]';
}

/** Share links only work with a shared database on a public host. */
export function canShareShipLinks(): boolean {
  return usesDatabaseStorage() && isPubliclyHosted();
}

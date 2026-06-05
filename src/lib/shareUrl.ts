/** Full URL for a ship's public sheet (respects Vite base path on GitHub Pages). */
export function shipShareUrl(shareToken: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${window.location.origin}${base}/ship/${shareToken}`;
}

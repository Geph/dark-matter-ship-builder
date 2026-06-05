/** Display label from package.json (e.g. 0.1.0 → v0.1). */
export function appVersionLabel(): string {
  const [major, minor] = __APP_VERSION__.split('.');
  return `v${major}.${minor ?? '0'}`;
}

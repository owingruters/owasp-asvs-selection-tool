/** Safe file name for a saved selection, e.g. "Acme Payments!" + "v2" -> "acme-payments-v2.asvs.json". */
export function profileFileName(name: string, profileVersion: string): string {
  const slug = (s: string) =>
    s
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 60);
  const parts = [slug(name), slug(profileVersion)].filter(Boolean);
  return `${parts.length > 0 ? parts.join('-') : 'asvs-selection'}.asvs.json`;
}

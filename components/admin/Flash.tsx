/** Viser "Gemt" / "Slettet" / fejl ud fra adressens ?-parametre. */
export default async function Flash({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  if (sp.fejl) return <p className="notice notice-error">{String(sp.fejl)}</p>;
  if (sp.gemt) return <p className="notice notice-ok">Gemt ✓ – ændringen er nu live på hjemmesiden.</p>;
  if (sp.slettet) return <p className="notice notice-ok">Slettet.</p>;
  return null;
}

export type SP = { searchParams: Promise<Record<string, string | string[] | undefined>> };

import Link from "next/link";
import { getMenuPages, getSettings, logoUrl } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let settings, menu: { slug: string; title: string }[] = [];
  let dbError: string | null = null;
  try {
    [settings, menu] = await Promise.all([getSettings(), getMenuPages()]);
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e);
  }

  const name = settings?.site_name ?? "Fyns Veteranknallert Klub";
  const links = [
    { href: "/", label: "Forside" },
    { href: "/arrangementer", label: "Arrangementer" },
    { href: "/nyheder", label: "Nyheder" },
    { href: "/galleri", label: "Galleri" },
    ...menu.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];

  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <Link href="/" className="brand">
            <img src={settings ? logoUrl(settings) : "/logo.png"} alt={name} className="brand-logo" />
            <span className="brand-text">
              <strong>{name}</strong>
              <small>{settings?.tagline ?? "Stiftet 1984"}</small>
            </span>
          </Link>
          <nav className="nav-desktop">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <details className="menu">
            <summary aria-label="Menu">
              <span className="burger" aria-hidden="true" />
              Menu
            </summary>
            <nav>
              {links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
        <div className="flag-stripe" aria-hidden="true" />
      </header>

      <main className="wrap main">
        {dbError ? (
          <div className="notice notice-error">
            <strong>Databasen er ikke forbundet endnu.</strong>
            <p>{dbError}</p>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <img src={settings ? logoUrl(settings) : "/logo.png"} alt="" className="footer-logo" />
            <p>{settings?.footer_text}</p>
          </div>
          <div>
            <h3>Kontakt</h3>
            {settings?.contact_name && <p>{settings.contact_name}</p>}
            {settings?.contact_email && (
              <p>
                <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
              </p>
            )}
            {settings?.contact_phone && (
              <p>
                <a href={`tel:${settings.contact_phone.replace(/\s/g, "")}`}>{settings.contact_phone}</a>
              </p>
            )}
          </div>
          <div>
            <h3>Klubben</h3>
            {settings?.address && <p>{settings.address}</p>}
            {settings?.cvr && <p>CVR: {settings.cvr}</p>}
            {settings?.facebook_url && (
              <p>
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
                  Følg os på Facebook →
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© {new Date().getFullYear()} {name}</span>
          <Link href="/admin">Admin</Link>
        </div>
      </footer>
    </>
  );
}

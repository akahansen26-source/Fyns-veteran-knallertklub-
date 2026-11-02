import Link from "next/link";
import { queryOne } from "@/lib/db";
import { todayIso } from "@/lib/content";

export default async function AdminHome() {
  const c = await queryOne(
    `SELECT
       (SELECT count(*) FROM events WHERE event_date >= $1)::int AS upcoming,
       (SELECT count(*) FROM posts)::int AS posts,
       (SELECT count(*) FROM pages)::int AS pages,
       (SELECT count(*) FROM images WHERE in_gallery)::int AS gallery`,
    [todayIso()]
  );

  const tiles = [
    { href: "/admin/arrangementer", n: c?.upcoming, label: "kommende arrangementer", add: "/admin/arrangementer/ny" },
    { href: "/admin/nyheder", n: c?.posts, label: "nyheder", add: "/admin/nyheder/ny" },
    { href: "/admin/sider", n: c?.pages, label: "sider", add: "/admin/sider/ny" },
    { href: "/admin/galleri", n: c?.gallery, label: "billeder i galleriet" },
  ];

  return (
    <>
      <h1>Oversigt</h1>
      <p className="muted">Her kan du rette alt indhold på hjemmesiden. Ændringer vises med det samme.</p>
      <div className="tiles">
        {tiles.map((t) => (
          <div key={t.href} className="tile">
            <Link href={t.href}>
              <strong>{t.n ?? 0}</strong>
              <span>{t.label}</span>
            </Link>
            {t.add && (
              <Link href={t.add} className="tile-add">
                + Tilføj
              </Link>
            )}
          </div>
        ))}
      </div>
      <div className="panel">
        <h2>Hvad kan jeg rette hvor?</h2>
        <ul>
          <li><strong>Arrangementer</strong> – klubaftener, løb, stumpemarkeder. Vises på forsiden og under Arrangementer.</li>
          <li><strong>Nyheder</strong> – opslag med tekst og billede.</li>
          <li><strong>Sider</strong> – Om klubben, Bliv medlem, Kontakt … Du kan også oprette nye sider, og de kommer automatisk i menuen.</li>
          <li><strong>Billeder & galleri</strong> – upload billeder til galleriet.</li>
          <li><strong>Indstillinger & logo</strong> – klubbens navn, velkomsttekst på forsiden, kontaktinfo, Facebook-link og logo.</li>
        </ul>
      </div>
    </>
  );
}

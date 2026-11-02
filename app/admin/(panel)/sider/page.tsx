import Link from "next/link";
import { query } from "@/lib/db";
import Flash, { type SP } from "@/components/admin/Flash";

export default async function AdminPages({ searchParams }: SP) {
  const pages = await query(`SELECT id, slug, title, show_in_menu, sort_order FROM pages ORDER BY sort_order, title`);
  return (
    <>
      <div className="admin-head">
        <h1>Sider</h1>
        <Link href="/admin/sider/ny" className="btn btn-red">+ Ny side</Link>
      </div>
      <p className="muted">
        Forsiden, Arrangementer, Nyheder og Galleri er faste. Velkomstteksten på forsiden rettes under Indstillinger.
      </p>
      <Flash searchParams={searchParams} />
      <table className="admin-table">
        <thead>
          <tr><th>Rækkefølge</th><th>Titel</th><th>Adresse</th><th>I menu</th><th></th></tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.id}>
              <td>{p.sort_order}</td>
              <td><Link href={`/admin/sider/${p.id}`}>{p.title}</Link></td>
              <td><a href={`/${p.slug}`} target="_blank" rel="noopener">/{p.slug}</a></td>
              <td>{p.show_in_menu ? "Ja" : "Nej"}</td>
              <td><Link href={`/admin/sider/${p.id}`} className="btn btn-small">Rediger</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

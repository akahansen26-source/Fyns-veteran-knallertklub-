import Link from "next/link";
import { query } from "@/lib/db";
import Flash, { type SP } from "@/components/admin/Flash";

export default async function AdminBoard({ searchParams }: SP) {
  const members = await query(
    `SELECT id, name, role, phone, image_id, sort_order FROM board_members ORDER BY sort_order, name`
  );
  return (
    <>
      <div className="admin-head">
        <h1>Bestyrelsen</h1>
        <Link href="/admin/bestyrelsen/ny" className="btn btn-red">+ Tilføj medlem</Link>
      </div>
      <p className="muted">Vises på siden <a href="/bestyrelsen" target="_blank" rel="noopener">/bestyrelsen</a>. Rækkefølgen styres af feltet &quot;Placering&quot;.</p>
      <Flash searchParams={searchParams} />
      {members.length === 0 ? (
        <p className="muted">Ingen bestyrelsesmedlemmer endnu.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th></th><th>Navn</th><th>Rolle</th><th></th></tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className="thumb-cell">
                  {m.image_id ? <img src={`/billede/${m.image_id}`} alt="" className="thumb" /> : <span className="thumb thumb-empty" />}
                </td>
                <td><Link href={`/admin/bestyrelsen/${m.id}`}>{m.name}</Link></td>
                <td>{m.role}</td>
                <td><Link href={`/admin/bestyrelsen/${m.id}`} className="btn btn-small">Rediger</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

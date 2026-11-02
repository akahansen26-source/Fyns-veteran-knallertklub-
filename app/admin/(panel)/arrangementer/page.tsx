import Link from "next/link";
import { query } from "@/lib/db";
import { EVENT_COLS, formatDate, todayIso } from "@/lib/content";
import Flash, { type SP } from "@/components/admin/Flash";

export default async function AdminEvents({ searchParams }: SP) {
  const today = todayIso();
  const events = await query(`SELECT ${EVENT_COLS} FROM events ORDER BY event_date DESC NULLS FIRST, id DESC`);
  return (
    <>
      <div className="admin-head">
        <h1>Arrangementer</h1>
        <Link href="/admin/arrangementer/ny" className="btn btn-red">+ Nyt arrangement</Link>
      </div>
      <Flash searchParams={searchParams} />
      {events.length === 0 ? (
        <p className="muted">Ingen arrangementer endnu.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Dato</th><th>Titel</th><th>Sted</th><th></th></tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className={e.event_date && e.event_date < today ? "dim" : ""}>
                <td>{formatDate(e.event_date, false)}</td>
                <td><Link href={`/admin/arrangementer/${e.id}`}>{e.title}</Link></td>
                <td>{e.location}</td>
                <td><Link href={`/admin/arrangementer/${e.id}`} className="btn btn-small">Rediger</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

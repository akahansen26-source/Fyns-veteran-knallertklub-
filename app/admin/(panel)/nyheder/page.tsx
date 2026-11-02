import Link from "next/link";
import { query } from "@/lib/db";
import { POST_COLS, formatDate } from "@/lib/content";
import Flash, { type SP } from "@/components/admin/Flash";

export default async function AdminPosts({ searchParams }: SP) {
  const posts = await query(`SELECT ${POST_COLS} FROM posts ORDER BY post_date DESC, id DESC`);
  return (
    <>
      <div className="admin-head">
        <h1>Nyheder</h1>
        <Link href="/admin/nyheder/ny" className="btn btn-red">+ Ny nyhed</Link>
      </div>
      <Flash searchParams={searchParams} />
      {posts.length === 0 ? (
        <p className="muted">Ingen nyheder endnu.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Dato</th><th>Titel</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td>{formatDate(p.post_date, false)}</td>
                <td><Link href={`/admin/nyheder/${p.id}`}>{p.title}</Link></td>
                <td>{p.published ? "Synlig" : <span className="tag">Kladde</span>}</td>
                <td><Link href={`/admin/nyheder/${p.id}`} className="btn btn-small">Rediger</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

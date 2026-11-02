import Link from "next/link";
import { query } from "@/lib/db";
import { POST_COLS, formatDate, renderMarkdown } from "@/lib/content";

export const metadata = { title: "Nyheder" };

function excerpt(md: string) {
  const text = md.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/[#*_>\[\]`]/g, "").replace(/\(([^)]*)\)/g, "");
  return text.length > 220 ? text.slice(0, 220).trimEnd() + "…" : text;
}

export default async function NewsPage() {
  const posts = await query(`SELECT ${POST_COLS} FROM posts WHERE published ORDER BY post_date DESC, id DESC`);
  return (
    <>
      <h1 className="page-title">Nyheder</h1>
      {posts.length === 0 && <p className="muted">Ingen nyheder endnu.</p>}
      <div className="news-list">
        {posts.map((p) => (
          <Link key={p.id} href={`/nyheder/${p.id}`} className="news-card">
            {p.image_id && <img src={`/billede/${p.image_id}`} alt="" />}
            <div>
              <span className="meta">{formatDate(p.post_date, false)}</span>
              <h2>{p.title}</h2>
              <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(excerpt(p.content)) }} />
              <span className="more">Læs mere →</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

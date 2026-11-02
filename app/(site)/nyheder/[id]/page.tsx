import Link from "next/link";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { POST_COLS, formatDate, renderMarkdown } from "@/lib/content";

export default async function NewsItem({ params }: { params: Promise<{ id: string }> }) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isFinite(id)) notFound();
  const post = await queryOne(`SELECT ${POST_COLS} FROM posts WHERE id = $1 AND published`, [id]);
  if (!post) notFound();

  return (
    <article className="article">
      <Link href="/nyheder" className="back">← Alle nyheder</Link>
      <span className="meta">{formatDate(post.post_date)}</span>
      <h1 className="page-title">{post.title}</h1>
      {post.image_id && <img src={`/billede/${post.image_id}`} alt="" className="article-img" />}
      <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
    </article>
  );
}

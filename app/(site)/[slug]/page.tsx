import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { renderMarkdown } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

async function getPage(slug: string) {
  return queryOne<{ title: string; content: string }>(`SELECT title, content FROM pages WHERE slug = $1`, [slug]);
}

export async function generateMetadata({ params }: Props) {
  const page = await getPage((await params).slug).catch(() => null);
  return { title: page?.title };
}

export default async function CustomPage({ params }: Props) {
  const page = await getPage((await params).slug);
  if (!page) notFound();
  return (
    <article className="article">
      <h1 className="page-title">{page.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }} />
    </article>
  );
}

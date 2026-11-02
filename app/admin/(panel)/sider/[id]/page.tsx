import Link from "next/link";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { deletePage, savePage } from "@/app/admin/actions";
import Flash, { type SP } from "@/components/admin/Flash";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function EditPage({ params, searchParams }: SP & { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "ny";
  const page = isNew ? null : await queryOne(`SELECT * FROM pages WHERE id = $1`, [Number(id) || 0]);
  if (!isNew && !page) notFound();

  return (
    <>
      <Link href="/admin/sider" className="back">← Sider</Link>
      <h1>{isNew ? "Ny side" : `Rediger: ${page!.title}`}</h1>
      <Flash searchParams={searchParams} />
      <form action={savePage} className="form">
        {page && <input type="hidden" name="id" value={page.id} />}
        <label className="field">
          <span className="label">Titel *</span>
          <input name="title" required defaultValue={page?.title ?? ""} />
        </label>
        <div className="row">
          <label className="field">
            <span className="label">Adresse (fx bliv-medlem)</span>
            <input name="slug" defaultValue={page?.slug ?? ""} placeholder="Laves automatisk ud fra titlen" />
          </label>
          <label className="field">
            <span className="label">Placering i menuen (lavest først)</span>
            <input type="number" name="sort_order" defaultValue={page?.sort_order ?? 10} />
          </label>
        </div>
        <label className="check">
          <input type="checkbox" name="show_in_menu" defaultChecked={page ? page.show_in_menu : true} />
          Vis i menuen
        </label>
        <MarkdownEditor name="content" defaultValue={page?.content ?? ""} rows={20} />
        <div className="form-actions">
          <button className="btn btn-red">Gem side</button>
          <Link href="/admin/sider" className="btn btn-ghost">Annuller</Link>
          {page && (
            <a href={`/${page.slug}`} target="_blank" rel="noopener" className="btn btn-ghost">Se siden ↗</a>
          )}
        </div>
      </form>
      {page && (
        <form action={deletePage} className="danger-zone">
          <input type="hidden" name="id" value={page.id} />
          <ConfirmButton message={`Slet siden "${page.title}"?`}>Slet side</ConfirmButton>
        </form>
      )}
    </>
  );
}

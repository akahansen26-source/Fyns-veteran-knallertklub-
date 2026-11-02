import Link from "next/link";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { POST_COLS, todayIso } from "@/lib/content";
import { deletePost, savePost } from "@/app/admin/actions";
import Flash, { type SP } from "@/components/admin/Flash";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import ImageField from "@/components/admin/ImageField";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function EditPost({ params, searchParams }: SP & { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "ny";
  const post = isNew ? null : await queryOne(`SELECT ${POST_COLS} FROM posts WHERE id = $1`, [Number(id) || 0]);
  if (!isNew && !post) notFound();

  return (
    <>
      <Link href="/admin/nyheder" className="back">← Nyheder</Link>
      <h1>{isNew ? "Ny nyhed" : "Rediger nyhed"}</h1>
      <Flash searchParams={searchParams} />
      <form action={savePost} className="form">
        {post && <input type="hidden" name="id" value={post.id} />}
        <label className="field">
          <span className="label">Overskrift *</span>
          <input name="title" required defaultValue={post?.title ?? ""} />
        </label>
        <label className="field narrow">
          <span className="label">Dato *</span>
          <input type="date" name="post_date" required defaultValue={post?.post_date ?? todayIso()} />
        </label>
        <ImageField name="image_id" label="Hovedbillede" defaultValue={post?.image_id} />
        <MarkdownEditor name="content" defaultValue={post?.content ?? ""} rows={16} />
        <label className="check">
          <input type="checkbox" name="published" defaultChecked={post ? post.published : true} />
          Vis på hjemmesiden (fjern fluebenet for at gemme som kladde)
        </label>
        <div className="form-actions">
          <button className="btn btn-red">Gem nyhed</button>
          <Link href="/admin/nyheder" className="btn btn-ghost">Annuller</Link>
        </div>
      </form>
      {post && (
        <form action={deletePost} className="danger-zone">
          <input type="hidden" name="id" value={post.id} />
          <ConfirmButton message={`Slet "${post.title}"?`}>Slet nyhed</ConfirmButton>
        </form>
      )}
    </>
  );
}

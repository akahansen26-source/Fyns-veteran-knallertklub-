import Link from "next/link";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { EVENT_COLS, todayIso } from "@/lib/content";
import { deleteEvent, saveEvent } from "@/app/admin/actions";
import Flash, { type SP } from "@/components/admin/Flash";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import ImageField from "@/components/admin/ImageField";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function EditEvent({ params, searchParams }: SP & { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "ny";
  const ev = isNew ? null : await queryOne(`SELECT ${EVENT_COLS} FROM events WHERE id = $1`, [Number(id) || 0]);
  if (!isNew && !ev) notFound();

  return (
    <>
      <Link href="/admin/arrangementer" className="back">← Arrangementer</Link>
      <h1>{isNew ? "Nyt arrangement" : "Rediger arrangement"}</h1>
      <Flash searchParams={searchParams} />
      <form action={saveEvent} className="form">
        {ev && <input type="hidden" name="id" value={ev.id} />}
        <label className="field">
          <span className="label">Titel *</span>
          <input name="title" required defaultValue={ev?.title ?? ""} placeholder="F.eks. Klubaften i Tommerup" />
        </label>
        <div className="row">
          <label className="field">
            <span className="label">Dato *</span>
            <input type="date" name="event_date" required defaultValue={ev?.event_date ?? todayIso()} />
          </label>
          <label className="field">
            <span className="label">Tidspunkt</span>
            <input name="event_time" defaultValue={ev?.event_time ?? ""} placeholder="F.eks. 19.00" />
          </label>
        </div>
        <label className="field">
          <span className="label">Sted</span>
          <input name="location" defaultValue={ev?.location ?? ""} placeholder="F.eks. Bannervej 17, Tommerup" />
        </label>
        <MarkdownEditor name="description" label="Beskrivelse" defaultValue={ev?.description ?? ""} rows={8} />
        <ImageField name="image_id" defaultValue={ev?.image_id} />
        <div className="form-actions">
          <button className="btn btn-red">Gem arrangement</button>
          <Link href="/admin/arrangementer" className="btn btn-ghost">Annuller</Link>
        </div>
      </form>
      {ev && (
        <form action={deleteEvent} className="danger-zone">
          <input type="hidden" name="id" value={ev.id} />
          <ConfirmButton message={`Slet "${ev.title}"?`}>Slet arrangement</ConfirmButton>
        </form>
      )}
    </>
  );
}

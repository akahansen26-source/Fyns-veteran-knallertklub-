import Link from "next/link";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { deleteMember, saveMember } from "@/app/admin/actions";
import Flash, { type SP } from "@/components/admin/Flash";
import ImageField from "@/components/admin/ImageField";
import ConfirmButton from "@/components/admin/ConfirmButton";

const ROLES = ["Formand", "Næstformand", "Kasserer", "Sekretær", "Bestyrelsesmedlem", "Suppleant", "Revisor"];

export default async function EditMember({ params, searchParams }: SP & { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "ny";
  const m = isNew ? null : await queryOne(`SELECT * FROM board_members WHERE id = $1`, [Number(id) || 0]);
  if (!isNew && !m) notFound();

  return (
    <>
      <Link href="/admin/bestyrelsen" className="back">← Bestyrelsen</Link>
      <h1>{isNew ? "Tilføj bestyrelsesmedlem" : `Rediger: ${m!.name}`}</h1>
      <Flash searchParams={searchParams} />
      <form action={saveMember} className="form">
        {m && <input type="hidden" name="id" value={m.id} />}
        <ImageField name="image_id" label="Foto" defaultValue={m?.image_id} />
        <div className="row">
          <label className="field">
            <span className="label">Navn *</span>
            <input name="name" required defaultValue={m?.name ?? ""} />
          </label>
          <label className="field">
            <span className="label">Rolle</span>
            <input name="role" list="roles" defaultValue={m?.role ?? ""} placeholder="Vælg eller skriv selv" />
            <datalist id="roles">
              {ROLES.map((r) => <option key={r} value={r} />)}
            </datalist>
          </label>
        </div>
        <div className="row">
          <label className="field">
            <span className="label">Telefon</span>
            <input name="phone" type="tel" defaultValue={m?.phone ?? ""} />
          </label>
          <label className="field">
            <span className="label">E-mail</span>
            <input name="email" type="email" defaultValue={m?.email ?? ""} />
          </label>
        </div>
        <label className="field">
          <span className="label">Kort tekst (valgfri)</span>
          <input name="note" defaultValue={m?.note ?? ""} placeholder="F.eks. Står for klubaftenerne" />
        </label>
        <label className="field narrow">
          <span className="label">Placering (lavest vises først)</span>
          <input type="number" name="sort_order" defaultValue={m?.sort_order ?? 10} />
        </label>
        <div className="form-actions">
          <button className="btn btn-red">Gem</button>
          <Link href="/admin/bestyrelsen" className="btn btn-ghost">Annuller</Link>
        </div>
      </form>
      {m && (
        <form action={deleteMember} className="danger-zone">
          <input type="hidden" name="id" value={m.id} />
          <ConfirmButton message={`Fjern ${m.name} fra bestyrelsen?`}>Fjern fra bestyrelsen</ConfirmButton>
        </form>
      )}
    </>
  );
}

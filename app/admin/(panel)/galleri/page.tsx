import { query } from "@/lib/db";
import { deleteImage, updateImage } from "@/app/admin/actions";
import Flash, { type SP } from "@/components/admin/Flash";
import GalleryUploader from "@/components/admin/GalleryUploader";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function AdminGallery({ searchParams }: SP) {
  const images = await query(
    `SELECT id, filename, caption, in_gallery, length(data) AS size FROM images ORDER BY created_at DESC`
  );
  return (
    <>
      <h1>Billeder & galleri</h1>
      <p className="muted">
        Alle billeder på hjemmesiden ligger her – også dem, der er brugt i arrangementer og nyheder.
        Sæt flueben ved &quot;Vis i galleri&quot; for at vise et billede på galleri-siden.
      </p>
      <GalleryUploader />
      <Flash searchParams={searchParams} />
      <div className="admin-gallery">
        {images.map((img) => (
          <div key={img.id} className="admin-img">
            <a href={`/billede/${img.id}`} target="_blank" rel="noopener">
              <img src={`/billede/${img.id}`} alt="" loading="lazy" />
            </a>
            <form action={updateImage}>
              <input type="hidden" name="id" value={img.id} />
              <input name="caption" defaultValue={img.caption ?? ""} placeholder="Billedtekst" />
              <label className="check">
                <input type="checkbox" name="in_gallery" defaultChecked={img.in_gallery} /> Vis i galleri
              </label>
              <button className="btn btn-small">Gem</button>
            </form>
            <form action={deleteImage}>
              <input type="hidden" name="id" value={img.id} />
              <ConfirmButton className="linklike danger" message="Slet billedet? Det fjernes også fra arrangementer/nyheder, hvor det er brugt.">
                Slet
              </ConfirmButton>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}

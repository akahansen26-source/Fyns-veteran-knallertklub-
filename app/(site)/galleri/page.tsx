import { query } from "@/lib/db";

export const metadata = { title: "Galleri" };

export default async function Gallery() {
  const images = await query<{ id: number; caption: string | null }>(
    `SELECT id, caption FROM images WHERE in_gallery ORDER BY created_at DESC`
  );
  return (
    <>
      <h1 className="page-title">Galleri</h1>
      {images.length === 0 && <p className="muted">Der er ingen billeder i galleriet endnu.</p>}
      <div className="gallery">
        {images.map((img) => (
          <a key={img.id} href={`/billede/${img.id}`} target="_blank" rel="noopener" className="gallery-item">
            <img src={`/billede/${img.id}`} alt={img.caption || ""} loading="lazy" />
            {img.caption && <span>{img.caption}</span>}
          </a>
        ))}
      </div>
    </>
  );
}

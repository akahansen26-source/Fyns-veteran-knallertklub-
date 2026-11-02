import { queryOne } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const num = Number.parseInt(id, 10);
  if (!Number.isFinite(num)) return new Response("Ikke fundet", { status: 404 });

  const img = await queryOne<{ mime: string; data: string }>(`SELECT mime, data FROM images WHERE id = $1`, [num]);
  if (!img) return new Response("Ikke fundet", { status: 404 });

  return new Response(new Uint8Array(Buffer.from(img.data, "base64")), {
    headers: {
      "Content-Type": img.mime,
      // Et billede-id ændrer aldrig indhold, så det kan caches længe
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

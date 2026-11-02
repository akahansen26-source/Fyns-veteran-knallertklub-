import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { queryOne } from "@/lib/db";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BASE64 = 4_000_000; // ca. 3 MB billede (Vercel tillader 4,5 MB pr. request)

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Ikke logget ind" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.data !== "string" || !ALLOWED.includes(body.mime)) {
    return NextResponse.json({ error: "Ugyldigt billede" }, { status: 400 });
  }
  if (body.data.length > MAX_BASE64) {
    return NextResponse.json({ error: "Billedet er for stort (max ca. 3 MB)" }, { status: 413 });
  }

  const row = await queryOne<{ id: number }>(
    `INSERT INTO images (filename, mime, data, caption, in_gallery) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [String(body.filename || "").slice(0, 200), body.mime, body.data, String(body.caption || "").slice(0, 500), !!body.gallery]
  );
  if (body.gallery) revalidatePath("/galleri");
  return NextResponse.json({ id: row!.id });
}

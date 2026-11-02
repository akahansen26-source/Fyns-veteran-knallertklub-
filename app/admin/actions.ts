"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { query, queryOne, DEFAULT_SETTINGS } from "@/lib/db";
import { RESERVED_SLUGS, slugify } from "@/lib/content";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const optStr = (fd: FormData, key: string) => str(fd, key) || null;
const optInt = (fd: FormData, key: string) => {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : null;
};
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

function fail(path: string, message: string): never {
  redirect(`${path}?fejl=${encodeURIComponent(message)}`);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

// ---------- Login ----------
export async function login(_prev: string | null, fd: FormData): Promise<string | null> {
  if (!process.env.ADMIN_PASSWORD) return "ADMIN_PASSWORD er ikke sat i Vercel endnu.";
  if (!checkPassword(str(fd, "password"))) {
    await new Promise((r) => setTimeout(r, 800)); // gør gætteri langsomt
    return "Forkert kodeord";
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Arrangementer ----------
export async function saveEvent(fd: FormData) {
  await requireAdmin();
  const id = optInt(fd, "id");
  const title = str(fd, "title");
  const date = str(fd, "event_date");
  if (!title || !isDate(date)) fail(`/admin/arrangementer/${id ?? "ny"}`, "Titel og dato skal udfyldes");

  const values = [title, date, optStr(fd, "event_time"), optStr(fd, "location"), optStr(fd, "description"), optInt(fd, "image_id")];
  if (id) {
    await query(
      `UPDATE events SET title=$1, event_date=$2, event_time=$3, location=$4, description=$5, image_id=$6 WHERE id=$7`,
      [...values, id]
    );
  } else {
    await query(
      `INSERT INTO events (title, event_date, event_time, location, description, image_id) VALUES ($1,$2,$3,$4,$5,$6)`,
      values
    );
  }
  refreshSite();
  redirect("/admin/arrangementer?gemt=1");
}

export async function deleteEvent(fd: FormData) {
  await requireAdmin();
  await query(`DELETE FROM events WHERE id = $1`, [optInt(fd, "id")]);
  refreshSite();
  redirect("/admin/arrangementer?slettet=1");
}

// ---------- Nyheder ----------
export async function savePost(fd: FormData) {
  await requireAdmin();
  const id = optInt(fd, "id");
  const title = str(fd, "title");
  const date = str(fd, "post_date");
  if (!title || !isDate(date)) fail(`/admin/nyheder/${id ?? "ny"}`, "Titel og dato skal udfyldes");

  const values = [title, str(fd, "content"), date, optInt(fd, "image_id"), fd.get("published") === "on"];
  if (id) {
    await query(`UPDATE posts SET title=$1, content=$2, post_date=$3, image_id=$4, published=$5 WHERE id=$6`, [...values, id]);
  } else {
    await query(`INSERT INTO posts (title, content, post_date, image_id, published) VALUES ($1,$2,$3,$4,$5)`, values);
  }
  refreshSite();
  redirect("/admin/nyheder?gemt=1");
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  await query(`DELETE FROM posts WHERE id = $1`, [optInt(fd, "id")]);
  refreshSite();
  redirect("/admin/nyheder?slettet=1");
}

// ---------- Sider ----------
export async function savePage(fd: FormData) {
  await requireAdmin();
  const id = optInt(fd, "id");
  const title = str(fd, "title");
  const slug = slugify(str(fd, "slug") || title);
  const back = `/admin/sider/${id ?? "ny"}`;
  if (!title) fail(back, "Titel skal udfyldes");
  if (!slug || RESERVED_SLUGS.includes(slug)) fail(back, `Adressen "${slug}" kan ikke bruges – vælg en anden`);

  const clash = await queryOne(`SELECT id FROM pages WHERE slug = $1 AND id <> $2`, [slug, id ?? 0]);
  if (clash) fail(back, `Der findes allerede en side med adressen /${slug}`);

  const values = [slug, title, str(fd, "content"), fd.get("show_in_menu") === "on", optInt(fd, "sort_order") ?? 0];
  if (id) {
    await query(
      `UPDATE pages SET slug=$1, title=$2, content=$3, show_in_menu=$4, sort_order=$5, updated_at=now() WHERE id=$6`,
      [...values, id]
    );
  } else {
    await query(`INSERT INTO pages (slug, title, content, show_in_menu, sort_order) VALUES ($1,$2,$3,$4,$5)`, values);
  }
  refreshSite();
  redirect("/admin/sider?gemt=1");
}

export async function deletePage(fd: FormData) {
  await requireAdmin();
  await query(`DELETE FROM pages WHERE id = $1`, [optInt(fd, "id")]);
  refreshSite();
  redirect("/admin/sider?slettet=1");
}

// ---------- Billeder ----------
export async function updateImage(fd: FormData) {
  await requireAdmin();
  await query(`UPDATE images SET caption = $1, in_gallery = $2 WHERE id = $3`, [
    str(fd, "caption"),
    fd.get("in_gallery") === "on",
    optInt(fd, "id"),
  ]);
  refreshSite();
  redirect("/admin/galleri?gemt=1");
}

export async function deleteImage(fd: FormData) {
  await requireAdmin();
  const id = optInt(fd, "id");
  await query(`UPDATE events SET image_id = NULL WHERE image_id = $1`, [id]);
  await query(`UPDATE posts SET image_id = NULL WHERE image_id = $1`, [id]);
  await query(`UPDATE settings SET value = '' WHERE key = 'logo_image_id' AND value = $1`, [String(id)]);
  await query(`DELETE FROM images WHERE id = $1`, [id]);
  refreshSite();
  redirect("/admin/galleri?slettet=1");
}

// ---------- Indstillinger ----------
export async function saveSettings(fd: FormData) {
  await requireAdmin();
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (!fd.has(key)) continue;
    await query(
      `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, str(fd, key)]
    );
  }
  refreshSite();
  redirect("/admin/indstillinger?gemt=1");
}

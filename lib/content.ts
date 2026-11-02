import { Marked } from "marked";
import { query, DEFAULT_SETTINGS } from "./db";

// ---------- Markdown ----------
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const marked = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    // Rå HTML vises som tekst – kun markdown er tilladt
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const safe = /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : "#";
      const external = /^https?:/i.test(safe);
      return `<a href="${escapeHtml(safe)}"${title ? ` title="${escapeHtml(title)}"` : ""}${
        external ? ' target="_blank" rel="noopener noreferrer"' : ""
      }>${text}</a>`;
    },
  },
});

export function renderMarkdown(src: string | null | undefined): string {
  return marked.parse(src || "", { async: false }) as string;
}

// ---------- Indstillinger ----------
export type Settings = typeof DEFAULT_SETTINGS;

export async function getSettings(): Promise<Settings> {
  const rows = await query<{ key: string; value: string }>(`SELECT key, value FROM settings`);
  const s: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const r of rows) s[r.key] = r.value;
  return s as Settings;
}

export function logoUrl(s: Settings) {
  return s.logo_image_id ? `/billede/${s.logo_image_id}` : "/logo.png";
}

export async function getMenuPages() {
  return query<{ slug: string; title: string }>(
    `SELECT slug, title FROM pages WHERE show_in_menu ORDER BY sort_order, title`
  );
}

// ---------- Datoer ----------
const MONTHS = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
const DAYS = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];

/** "2026-11-02" → "mandag d. 2. november 2026" */
export function formatDate(iso: string | null | undefined, withWeekday = true): string {
  if (!iso) return "Dato følger";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const wd = DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${withWeekday ? wd + " d. " : ""}${d}. ${MONTHS[m - 1]} ${y}`;
}

export function dateParts(iso: string | null | undefined) {
  if (!iso) return { day: "?", month: "" };
  const [, m, d] = iso.split("-").map(Number);
  return { day: String(d), month: MONTHS[m - 1]?.slice(0, 3) ?? "" };
}

/** Dagens dato i dansk tid som YYYY-MM-DD */
export function todayIso(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Copenhagen" }).format(new Date());
}

// ---------- Slugs ----------
export const RESERVED_SLUGS = ["admin", "api", "billede", "arrangementer", "nyheder", "galleri", "logo.png", "icon.png", "_next"];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const EVENT_COLS = `id, title, event_date::text AS event_date, event_time, location, description, image_id`;
export const POST_COLS = `id, title, content, post_date::text AS post_date, image_id, published`;

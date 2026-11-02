import { neon } from "@neondatabase/serverless";

export type Row = Record<string, any>;
type Runner = (text: string, params: unknown[]) => Promise<Row[]>;

let runner: Runner | null = null;

async function getRunner(): Promise<Runner> {
  if (runner) return runner;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL mangler. Tilføj den under Settings → Environment Variables i Vercel."
    );
  }
  if (/@(localhost|127\.0\.0\.1)[:/]/.test(url)) {
    // Lokal udvikling mod en almindelig Postgres
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url });
    runner = async (text, params) => (await pool.query(text, params as any[])).rows;
  } else {
    // Neon (produktion på Vercel)
    const sql = neon(url);
    runner = async (text, params) => (await sql.query(text, params as any[])) as Row[];
  }
  return runner;
}

/** Kør en SQL-forespørgsel med $1, $2 ... parametre. */
export async function query<T extends Row = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  const run = await getRunner();
  return (await run(text, params)) as T[];
}

export async function queryOne<T extends Row = Row>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

// ---------------------------------------------------------------------------
// Tabellerne oprettes automatisk første gang siden kører – ingen SQL i hånden.
// ---------------------------------------------------------------------------

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS images (
     id SERIAL PRIMARY KEY,
     filename TEXT,
     mime TEXT NOT NULL,
     data TEXT NOT NULL,
     caption TEXT,
     in_gallery BOOLEAN NOT NULL DEFAULT false,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS pages (
     id SERIAL PRIMARY KEY,
     slug TEXT NOT NULL UNIQUE,
     title TEXT NOT NULL,
     content TEXT NOT NULL DEFAULT '',
     updated_at TIMESTAMP DEFAULT now()
   )`,
  `ALTER TABLE pages ADD COLUMN IF NOT EXISTS show_in_menu BOOLEAN NOT NULL DEFAULT true`,
  `ALTER TABLE pages ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`,
  `CREATE TABLE IF NOT EXISTS events (id SERIAL PRIMARY KEY, title TEXT NOT NULL, created_at TIMESTAMP DEFAULT now())`,
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date DATE`,
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS event_time TEXT`,
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT`,
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS description TEXT`,
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS image_id INTEGER`,
  // Den gamle version havde en "date" tekstkolonne – gør den valgfri, hvis den findes.
  `DO $$ BEGIN
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'date') THEN
       ALTER TABLE events ALTER COLUMN "date" DROP NOT NULL;
     END IF;
   END $$`,
  `CREATE TABLE IF NOT EXISTS posts (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT NOT NULL DEFAULT '',
     post_date DATE NOT NULL DEFAULT CURRENT_DATE,
     image_id INTEGER,
     published BOOLEAN NOT NULL DEFAULT true
   )`,
];

const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: "Fyns Veteranknallert Klub",
  tagline: "Stiftet 1984",
  hero_title: "Velkommen til Fyns Veteranknallert Klub",
  hero_text:
    "Vi holder liv i de gamle knallerter – især de dansk producerede. Kom med til klubaftener, løb, stumpemarkeder og hyggeligt samvær på Fyn.",
  contact_name: "Aase Larsen (kasserer)",
  contact_email: "Kasserer.fvkk@gmail.com",
  contact_phone: "30 55 46 83",
  address: "Bannervej 17, 5690 Tommerup",
  cvr: "21198781",
  facebook_url: "https://www.facebook.com/123fvkk",
  footer_text: "Fyns Veteranknallert Klub · Stiftet 1984",
  logo_image_id: "",
};

const DEFAULT_PAGES = [
  {
    slug: "om-klubben",
    title: "Om klubben",
    sort: 1,
    content: `Fyns Veteranknallert Klub blev stiftet i **1984**.

Vores vigtigste formål er at bevare interessen for veteranknallerter – og især de dansk producerede modeller – og at skabe et godt fællesskab for alle, der holder af dem.

## Det laver vi
- Klubaftener
- Løb og ture på Fyn
- Stumpemarkeder
- Sociale arrangementer

*Denne tekst kan rettes under Admin → Sider.*`,
  },
  {
    slug: "bliv-medlem",
    title: "Bliv medlem",
    sort: 2,
    content: `Nye medlemmer er altid velkomne – uanset om du har en knallert, er ved at restaurere en, eller bare holder af dem.

Kontakt kassereren for at høre mere om kontingent og indmeldelse:

**Aase Larsen** – [Kasserer.fvkk@gmail.com](mailto:Kasserer.fvkk@gmail.com) – 30 55 46 83

*Denne tekst kan rettes under Admin → Sider.*`,
  },
  {
    slug: "kontakt",
    title: "Kontakt",
    sort: 3,
    content: `**Kasserer:** Aase Larsen
[Kasserer.fvkk@gmail.com](mailto:Kasserer.fvkk@gmail.com) · 30 55 46 83

**Kurt Larsen:** 20 54 68 53

**Adresse:** Bannervej 17, 5690 Tommerup
**CVR:** 21198781

Følg os på [Facebook](https://www.facebook.com/123fvkk).`,
  },
];

let schemaPromise: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const run = await getRunner();
      for (const stmt of SCHEMA) await run(stmt, []);
      const seeded = await run(`SELECT value FROM settings WHERE key = 'seeded'`, []);
      if (seeded.length === 0) {
        for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
          await run(`INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`, [k, v]);
        }
        for (const p of DEFAULT_PAGES) {
          await run(
            `INSERT INTO pages (slug, title, content, show_in_menu, sort_order) VALUES ($1, $2, $3, true, $4)
             ON CONFLICT (slug) DO NOTHING`,
            [p.slug, p.title, p.content, p.sort]
          );
        }
        await run(`INSERT INTO settings (key, value) VALUES ('seeded', '1') ON CONFLICT (key) DO NOTHING`, []);
      }
    })().catch((err) => {
      schemaPromise = null;
      throw err;
    });
  }
  return schemaPromise;
}

export { DEFAULT_SETTINGS };

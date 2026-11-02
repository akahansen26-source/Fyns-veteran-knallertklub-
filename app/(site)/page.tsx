import Link from "next/link";
import { query } from "@/lib/db";
import { EVENT_COLS, POST_COLS, formatDate, getSettings, logoUrl, renderMarkdown, todayIso } from "@/lib/content";
import EventCard, { type EventRow } from "@/components/EventCard";

export default async function Home() {
  const today = todayIso();
  const [settings, upcoming, posts] = await Promise.all([
    getSettings(),
    query<EventRow>(
      `SELECT ${EVENT_COLS} FROM events WHERE event_date >= $1 ORDER BY event_date, event_time LIMIT 4`,
      [today]
    ),
    query(`SELECT ${POST_COLS} FROM posts WHERE published ORDER BY post_date DESC, id DESC LIMIT 3`),
  ]);

  return (
    <>
      <section className="hero">
        <img src={logoUrl(settings)} alt={settings.site_name} className="hero-logo" />
        <div className="hero-text">
          <h1>{settings.hero_title}</h1>
          <div className="prose lead" dangerouslySetInnerHTML={{ __html: renderMarkdown(settings.hero_text) }} />
          <div className="actions">
            <Link className="btn btn-red" href="/arrangementer">Se arrangementer</Link>
            <Link className="btn btn-ghost" href="/bliv-medlem">Bliv medlem</Link>
          </div>
        </div>
      </section>

      <div className="home-grid">
        <section>
          <div className="section-head">
            <h2>Kommende arrangementer</h2>
            <Link href="/arrangementer">Alle →</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="muted">Der er ingen kommende arrangementer lige nu. Kig forbi igen snart!</p>
          ) : (
            <div className="stack">
              {upcoming.map((ev) => (
                <Link key={ev.id} href={`/arrangementer#a${ev.id}`} className="card-link">
                  <EventCard ev={ev} />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="section-head">
            <h2>Nyheder</h2>
            <Link href="/nyheder">Alle →</Link>
          </div>
          {posts.length === 0 ? (
            <p className="muted">Ingen nyheder endnu.</p>
          ) : (
            <div className="stack">
              {posts.map((p) => (
                <Link key={p.id} href={`/nyheder/${p.id}`} className="news-item">
                  {p.image_id && <img src={`/billede/${p.image_id}`} alt="" />}
                  <div>
                    <span className="meta">{formatDate(p.post_date, false)}</span>
                    <h3>{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

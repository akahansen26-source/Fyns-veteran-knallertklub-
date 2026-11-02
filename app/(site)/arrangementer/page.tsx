import { query } from "@/lib/db";
import { EVENT_COLS, todayIso } from "@/lib/content";
import EventCard, { type EventRow } from "@/components/EventCard";

export const metadata = { title: "Arrangementer" };

export default async function EventsPage() {
  const today = todayIso();
  const [upcoming, past] = await Promise.all([
    query<EventRow>(
      `SELECT ${EVENT_COLS} FROM events WHERE event_date >= $1 OR event_date IS NULL ORDER BY event_date NULLS LAST, event_time`,
      [today]
    ),
    query<EventRow>(`SELECT ${EVENT_COLS} FROM events WHERE event_date < $1 ORDER BY event_date DESC LIMIT 30`, [today]),
  ]);

  return (
    <>
      <h1 className="page-title">Arrangementer</h1>
      {upcoming.length === 0 ? (
        <p className="muted">Der er ingen kommende arrangementer lige nu.</p>
      ) : (
        <div className="stack">
          {upcoming.map((ev) => (
            <EventCard key={ev.id} ev={ev} full />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="subhead">Tidligere arrangementer</h2>
          <div className="stack">
            {past.map((ev) => (
              <EventCard key={ev.id} ev={ev} full past />
            ))}
          </div>
        </>
      )}
    </>
  );
}

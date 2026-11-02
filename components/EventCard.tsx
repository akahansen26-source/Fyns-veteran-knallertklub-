import { dateParts, formatDate, renderMarkdown } from "@/lib/content";

export type EventRow = {
  id: number;
  title: string;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  description: string | null;
  image_id: number | null;
};

export default function EventCard({ ev, full = false, past = false }: { ev: EventRow; full?: boolean; past?: boolean }) {
  const { day, month } = dateParts(ev.event_date);
  return (
    <article className={`event-card${past ? " is-past" : ""}`} id={`a${ev.id}`}>
      <div className="date-badge" aria-hidden="true">
        <span className="d">{day}</span>
        <span className="m">{month}</span>
      </div>
      <div className="event-body">
        <h3>{ev.title}</h3>
        <p className="meta">
          {formatDate(ev.event_date)}
          {ev.event_time && <> · kl. {ev.event_time}</>}
          {ev.location && <> · {ev.location}</>}
        </p>
        {full && ev.description && (
          <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(ev.description) }} />
        )}
      </div>
      {full && ev.image_id && <img src={`/billede/${ev.image_id}`} alt="" className="event-img" />}
    </article>
  );
}

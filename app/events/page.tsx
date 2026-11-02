import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let all: any[] = [];
  try {
    all = await db.select().from(events).orderBy(desc(events.date));
  } catch {}

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Arrangementer</h1>
      {all.length === 0 ? (
        <p>Ingen arrangementer endnu.</p>
      ) : (
        <ul className="space-y-6">
          {all.map((ev) => (
            <li key={ev.id} className="border p-5 rounded-lg">
              <h2 className="text-xl font-semibold">{ev.title}</h2>
              <p className="text-gray-600">{ev.date} {ev.time}</p>
              {ev.location && <p className="mt-1">{ev.location}</p>}
              {ev.description && <p className="mt-2 whitespace-pre-wrap">{ev.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

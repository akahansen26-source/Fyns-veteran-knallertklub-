import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function Home() {
  let upcoming: any[] = [];
  try {
    upcoming = await db.select().from(events).orderBy(desc(events.date)).limit(5);
  } catch (e) {
    // DB not ready yet
  }

  return (
    <div>
      <div className="bg-yellow-400 text-center py-8 mb-8 rounded-lg border-4 border-red-600">
        <h2 className="text-4xl font-bold mb-2">Velkommen til Fyns Veteranknallert Klub</h2>
        <p className="text-xl">Stiftet 1984 · WWW.123FVKK.DK</p>
      </div>

      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Kommende arrangementer</h3>
        {upcoming.length === 0 ? (
          <p>Ingen arrangementer endnu. Tjek tilbage snart!</p>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((ev) => (
              <li key={ev.id} className="border p-4 rounded">
                <h4 className="font-bold">{ev.title}</h4>
                <p>{ev.date} {ev.time && `· ${ev.time}`}</p>
                {ev.location && <p className="text-sm text-gray-600">{ev.location}</p>}
                {ev.description && <p className="mt-2">{ev.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">Om klubben</h3>
        <p>
          Fyns Veteranknallert Klubs vigtigste formål er at bibeholde interessen for veteranknallerter 
          og specielt dansk producerede knallerter. Vi mødes til klubaftener, løb og sociale arrangementer.
        </p>
        <p className="mt-4">
          Nye medlemmer er velkomne! Kontakt kassereren for mere info.
        </p>
      </section>
    </div>
  );
}

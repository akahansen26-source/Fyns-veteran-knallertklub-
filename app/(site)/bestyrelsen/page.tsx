import { query } from "@/lib/db";

export const metadata = { title: "Bestyrelsen" };

type Member = {
  id: number;
  name: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  note: string | null;
  image_id: number | null;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export default async function BoardPage() {
  const members = await query<Member>(
    `SELECT id, name, role, phone, email, note, image_id FROM board_members ORDER BY sort_order, name`
  );
  return (
    <>
      <h1 className="page-title">Bestyrelsen</h1>
      {members.length === 0 && <p className="muted">Bestyrelsen er ikke tilføjet endnu.</p>}
      <div className="board">
        {members.map((m) => (
          <article key={m.id} className="member">
            {m.image_id ? (
              <img src={`/billede/${m.image_id}`} alt={m.name} className="member-photo" />
            ) : (
              <div className="member-photo member-initials" aria-hidden="true">{initials(m.name)}</div>
            )}
            <div className="member-body">
              {m.role && <span className="member-role">{m.role}</span>}
              <h2>{m.name}</h2>
              {m.phone && (
                <p><a href={`tel:${m.phone.replace(/\s/g, "")}`}>☎ {m.phone}</a></p>
              )}
              {m.email && (
                <p><a href={`mailto:${m.email}`}>✉ {m.email}</a></p>
              )}
              {m.note && <p className="muted">{m.note}</p>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

# Fyns Veteranknallert Klub

Hjemmeside for Fyns Veteranknallert Klub (stiftet 1984).

## Stack
- Next.js 15 (App Router)
- Tailwind CSS
- Neon Postgres
- Vercel

## Opsætning

1. Opret en database på [console.neon.tech](https://console.neon.tech)
2. Kør SQL fra `init.sql` i Neon SQL Editor
3. Kopiér connection string (DATABASE_URL)
4. I Vercel: Import dette repo og tilføj environment variables:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD` (vælg et sikkert kodeord)
5. Deploy

## Admin
Gå til `/admin` og log ind med ADMIN_PASSWORD for at tilføje arrangementer.

## Sider
- `/` – Forside med kommende arrangementer
- `/events` – Alle arrangementer
- `/about` – Om klubben
- `/admin` – Rediger indhold

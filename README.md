# Fyns Veteranknallert Klub

Hjemmeside for Fyns Veteranknallert Klub (stiftet 1984) – med admin, hvor alt indhold kan redigeres.

**Teknik:** Next.js (kører på Vercel) + Postgres-database hos Neon. Billeder gemmes også i databasen, så der skal ikke sættes andre tjenester op.

## Sådan sættes den i luften

### 1. Database hos Neon
1. Log ind på [console.neon.tech](https://console.neon.tech) og opret et projekt (vælg region **Europe (Frankfurt)**).
2. Tryk **Connect** og kopiér *connection string* – den starter med `postgresql://…`

Du behøver **ikke** køre SQL. Tabellerne oprettes automatisk første gang siden åbnes.

### 2. Hjemmesiden hos Vercel
1. Log ind på [vercel.com](https://vercel.com) med din GitHub-konto.
2. **Add New → Project** → vælg repoet `Fyns-veteran-knallertklub-` → **Import**.
3. Åbn **Environment Variables** og tilføj:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | connection string fra Neon |
   | `ADMIN_PASSWORD` | et kodeord, som kun bestyrelsen kender |

4. Tryk **Deploy**. Efter et minut er siden live på en `…vercel.app`-adresse.

> Alternativ til trin 1: I Vercel-projektet under **Storage → Neon** kan du oprette databasen direkte – så sættes `DATABASE_URL` automatisk.

### 3. Eget domæne (valgfrit)
I Vercel: **Settings → Domains** → tilføj `123fvkk.dk` og følg anvisningen om DNS hos jeres domæneudbyder.

## Admin
Gå til `/admin` (eller klik "Admin" nederst på siden) og log ind med `ADMIN_PASSWORD`.

| Menu | Hvad kan rettes |
|---|---|
| Arrangementer | Opret, ret og slet arrangementer (dato, tid, sted, beskrivelse, billede) |
| Nyheder | Nyheder med billede – kan gemmes som kladde |
| Sider | Om klubben, Bliv medlem, Kontakt + nye sider, der automatisk kommer i menuen |
| Billeder & galleri | Upload billeder, billedtekster, vis/skjul i galleriet |
| Indstillinger & logo | Navn, velkomsttekst på forsiden, kontaktinfo, Facebook, logo |

Ændringer vises på hjemmesiden med det samme. Skift kodeord ved at ændre `ADMIN_PASSWORD` i Vercel og trykke **Redeploy** (alle bliver logget ud).

## Udvikling på egen computer
```bash
npm install
cp .env.example .env.local   # udfyld DATABASE_URL og ADMIN_PASSWORD
npm run dev
```

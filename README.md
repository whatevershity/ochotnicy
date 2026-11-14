# Ochotnicy Wolności

Strona Stowarzyszenia Ochotnicy Wolności — Next.js (App Router), TypeScript, Tailwind CSS.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja: [http://localhost:3456](http://localhost:3456).

| Komenda | Opis |
|---------|------|
| `npm run dev` | Serwer deweloperski (port 3456) |
| `npm run build` | Build produkcyjny |
| `npm run start` | Start buildu produkcyjnego |
| `npm run lint` | ESLint |

## Wdrożenie na Vercel (zalecane)

Publikacja w Cursorze bywa zablokowana przez przegląd bezpieczeństwa — Vercel omija ten problem.

### A) Z GitHuba (najwygodniej na później)

1. Utwórz nowe puste repo na GitHubie (np. `ochotnicy-wolnosci`).
2. Wypchnij ten projekt:

```bash
git remote add github https://github.com/TWOJ_LOGIN/ochotnicy-wolnosci.git
git push -u github main
```

3. Wejdź na [vercel.com](https://vercel.com) → **Add New…** → **Project** → Import tego repo.
4. Framework: Next.js (wykryje sam). **Deploy**.

### B) Drag & Drop (bez GitHuba)

1. Rozpakuj ZIP projektu (bez `node_modules` / `.next`).
2. Vercel → **Add New…** → **Project** → zakładka upload / drag & drop folderu.
3. Deploy.

### Zmienne środowiskowe (opcjonalnie)

Bez nich strona działa na treściach z `content/` (Markdown). Panel `/admin` i trwała baza wymagają Postgresa:

| Nazwa | Po co |
|-------|--------|
| `DATABASE_URL` | Postgres (np. Vercel Storage → Neon) |
| `DATABASE_URL_UNPOOLED` | Migracje (Neon: connection string bez poolera) |
| `ADMIN_PASSWORD` | Hasło do `/admin` (gdy włączona ochrona) |

Po dodaniu bazy: redeploy — skrypt `npm run build` odpala migracje.

## Struktura

- `src/app/` — App Router
- `content/aktualnosci/` — wpisy Markdown
- `public/` — zdjęcia i media
- `/admin` — panel dodawania treści

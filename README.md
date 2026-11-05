# pustaka-terbuka

An open library catalog built only on public data. No accounts, no backend, no visitor tracking.

## Data sources

| Source                                                             | Used for                        | Terms                                                       |
| ------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------- |
| [Open Library](https://openlibrary.org/developers/licensing)       | Book catalog, authors, subjects | The Internet Archive asserts no new copyright over the data |
| [Open Library Covers](https://openlibrary.org/dev/docs/api/covers) | Book covers                     | Link back to Open Library; covers are loaded by CoverID     |

Every page credits its data source in the footer, and each book page links to its Open Library record.

## Pages

| Path                 | What it shows                       |
| -------------------- | ----------------------------------- |
| `/`                  | Books grouped by subject            |
| `/books/?subject=…`  | All books in one subject, paginated |
| `/book/?id=OL…W`     | One book (an Open Library work)     |
| `/search/?keyword=…` | Search by title, author or ISBN     |

## Getting started

Needs Node 22 and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Command                       | What it does                                                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm test --coverage`        | Unit tests; fails below 95/85/95/95 coverage                                                                      |
| `pnpm e2e`                    | Builds the static export, serves it under `/pustaka-terbuka/`, runs Playwright with axe (Open Library is stubbed) |
| `pnpm size`                   | Builds and checks the bundle size budget                                                                          |
| `pnpm typecheck`, `pnpm lint` | TypeScript and ESLint                                                                                             |

The interface is in Indonesian and English. All text lives in `src/i18n/en.ts`
and `src/i18n/id.ts`, which must have the same keys (a test checks this).

## Deploy

`.github/workflows/ci.yml` runs every gate on each pull request and push:
types, lint, formatting, unit tests with coverage, the size budget, the
end-to-end tests and a gitleaks secret scan. A push to `main` that passes
them all is built with `NEXT_PUBLIC_BASE_PATH` set to the repository name and
published to GitHub Pages (Settings → Pages → Source: "GitHub Actions").

## Tech stack

Next.js (App Router, static export), Tailwind CSS, shadcn/ui, Redux Toolkit with RTK Query.

## Licence

Code: MIT (see `LICENSE`). Book data and covers keep the terms of their sources (see the table above).

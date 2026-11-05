# pustaka-terbuka

An open library catalog built only on public data. No accounts, no backend, no visitor tracking.

## Data sources

| Source | Used for | Terms |
| --- | --- | --- |
| [Open Library](https://openlibrary.org/developers/licensing) | Book catalog, authors, subjects | The Internet Archive asserts no new copyright over the data |
| [Open Library Covers](https://openlibrary.org/dev/docs/api/covers) | Book covers | Link back to Open Library; covers are loaded by CoverID |

Every page credits its data source in the footer, and each book page links to its Open Library record.

## Pages

| Path | What it shows |
| --- | --- |
| `/` | Books grouped by subject |
| `/books/?subject=…` | All books in one subject, paginated |
| `/book/?id=OL…W` | One book (an Open Library work) |
| `/search/?keyword=…` | Search by title, author or ISBN |

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

`pnpm build` writes a static site to `out/`. The workflow in `.github/workflows/deploy.yml` builds it on every push to `main` and publishes it to GitHub Pages, with `NEXT_PUBLIC_BASE_PATH` set to the repository name. In the repository settings, set Pages → Source to "GitHub Actions".

## Tech stack

Next.js (App Router, static export), Tailwind CSS, shadcn/ui, Redux Toolkit with RTK Query.

## Licence

Code: MIT (see `LICENSE`). Book data and covers keep the terms of their sources (see the table above).

# SvelteBooks

SvelteBooks is a Goodreads catalog browser built from the UCSD [Book Graph dataset](https://mengtingwan.github.io/data/goodreads.html): a filterable, paginated cover grid with full-text search and book detail pages. It is a port of [next-books](https://github.com/vercel-labs/next-books) ([live demo](https://www.next-books.dev)). The stack is SvelteKit 3, Svelte 5, Drizzle, Neon Postgres, Tailwind v4, deployed on Vercel. The catalog is a ~100K-book subset of the original's 2.36M, sized for the Neon free tier.

## Run locally

Requires Node 20.6+ (for `--env-file`, used by the `tsx` scripts), pnpm, and a [Neon](https://neon.com) Postgres database — the free tier is enough.

```sh
pnpm install
```

Create a `.env` file with your connection string:

```sh
DATABASE_URL="postgres://..."
```

`DATABASE_URL` is declared in `src/env.ts`; the app reads it via `$app/env/private` and the seeding scripts via `process.env`.

Create the schema and start the dev server:

```sh
pnpm db:push
pnpm dev
```

For a production build:

```sh
pnpm build
pnpm preview
```

Without a `DATABASE_URL` the app still runs — queries are served from a small generated preview catalog instead of the database.

## Seeding the database

The dataset comes from the [UCSD Book Graph project](https://mengtingwan.github.io/data/goodreads.html). Download the compressed book and author metadata files into the gitignored `data/` directory (the books file is ~2 GB):

```sh
mkdir -p data
curl -L https://mcauleylab.ucsd.edu/public_datasets/gdrive/goodreads/goodreads_books.json.gz -o data/books.json.gz
curl -L https://mcauleylab.ucsd.edu/public_datasets/gdrive/goodreads/goodreads_book_authors.json.gz -o data/authors.json.gz
```

Select the subset to import — two passes over the books file: the first collects candidates (books with a real cover image, a supported language, published 1950–2023), the second writes the selection. Candidates are ranked by `ratings_count` and the top `MAX_BOOKS` are kept (default 100000); every ISBN from the curated sidebar lists is force-included even if it wouldn't make the top N. Writes `data/selected-books.ndjson` and `data/author-ids.json`:

```sh
pnpm db:select
```

Seed the authors referenced by the selection, then the books:

```sh
pnpm db:seed-authors
pnpm db:seed-books
```

Alternatively, run push and both seeds in one go:

```sh
pnpm db:setup
```

Optionally generate thumbhash placeholders — this fetches every cover image (~100K requests), so it's slow:

```sh
pnpm db:seed-thumbhash
```

~100K books with authors and indexes fits comfortably in Neon's 0.5 GB free tier. If you have room, raise `MAX_BOOKS` before `pnpm db:select` and `TOTAL_BOOKS` before seeding.

Interrupted seeds resume from their checkpoint files (`*_checkpoint.json` in the project root). Delete a checkpoint to start that seed over.

## Deploying to Vercel

The app uses `@sveltejs/adapter-vercel`, configured in `vite.config.ts`. Set `DATABASE_URL` in your project's environment variables. It makes use of the Vercel Runtime Cache to speed up subsequent book (search) requests.

## Credits

[next-books](https://github.com/vercel-labs/next-books) by Vercel Labs (MIT). Dataset by Mengting Wan / the [UCSD Book Graph project](https://mengtingwan.github.io/data/goodreads.html).

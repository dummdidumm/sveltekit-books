import fs from 'fs/promises';
import path from 'path';
import { sql } from './db';
import { processEntities } from './seed-utils';

const BATCH_SIZE = 2000;
const DATA_FILE = path.resolve(process.env.AUTHORS_DATA_PATH ?? './data/authors.json.gz');
const CHECKPOINT_FILE = path.resolve(
	process.env.AUTHORS_CHECKPOINT_PATH ?? 'authors_checkpoint.json'
);

// https://mcauleylab.ucsd.edu/public_datasets/gdrive/goodreads/goodreads_book_authors.json.gz
const TOTAL_AUTHORS = Number(process.env.TOTAL_AUTHORS ?? 829529);

interface AuthorData {
	average_rating: string;
	author_id: string;
	name: string;
	ratings_count: string;
}

async function loadAuthorIds(): Promise<Set<string>> {
	try {
		const data = await fs.readFile('./data/author-ids.json', 'utf8');
		return new Set(JSON.parse(data) as string[]);
	} catch (error) {
		console.error('Failed to load ./data/author-ids.json — run `pnpm db:select` first.', error);
		process.exit(1);
	}
}

async function main() {
	try {
		const authorIds = await loadAuthorIds();

		const insertQuery = `
			INSERT INTO authors (id, name, average_rating, ratings_count)
			VALUES ($1, $2, $3::numeric, $4::integer)
			ON CONFLICT (id) DO NOTHING
		`;

		const batchInsertAuthors = async (batch: AuthorData[]) => {
			const filtered = batch.filter((author) => authorIds.has(author.author_id));
			if (filtered.length === 0) return;

			const queries = filtered.map((author) =>
				sql.query(insertQuery, [
					author.author_id,
					author.name,
					author.average_rating,
					author.ratings_count ? parseInt(author.ratings_count) : null
				])
			);

			await sql.transaction(queries);
		};

		const authorCount = await processEntities<AuthorData>(
			DATA_FILE,
			CHECKPOINT_FILE,
			BATCH_SIZE,
			batchInsertAuthors,
			sql,
			TOTAL_AUTHORS
		);
		console.log(
			`Seeded ${authorCount.toLocaleString()} / ${TOTAL_AUTHORS.toLocaleString()} authors`
		);
	} catch (error) {
		console.error('Error seeding authors:', error);
		process.exitCode = 1;
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

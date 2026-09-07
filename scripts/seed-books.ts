import path from 'path';
import { sql } from './db';
import { processEntities } from './seed-utils';

const BATCH_SIZE = 900;
const DATA_FILE = path.resolve(process.env.BOOKS_DATA_PATH ?? './data/selected-books.ndjson');
const CHECKPOINT_FILE = path.resolve(process.env.BOOKS_CHECKPOINT_PATH ?? 'books_checkpoint.json');

const TOTAL_BOOKS = Number(process.env.TOTAL_BOOKS ?? 100000);

interface BookData {
	book_id: string;
	isbn: string | null;
	title: string;
	authors: { author_id: string }[];
	publication_year: string | null;
	publisher: string | null;
	image_url: string | null;
	description: string | null;
	num_pages: string | null;
	language_code: string | null;
	ratings_count: string | null;
	average_rating: string | null;
}

async function batchInsertBooks(batch: BookData[]) {
	const insertBookAndAuthorsQuery = `
		WITH inserted_book AS (
			INSERT INTO books (id, isbn, title, publication_year, publisher, image_url, description, num_pages, language_code, ratings_count, average_rating, title_tsv)
			VALUES ($1::integer, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, unaccent($3))
			ON CONFLICT DO NOTHING
			RETURNING id
		)
		INSERT INTO book_to_author (book_id, author_id)
		SELECT inserted_book.id, unnest($12::text[])
		FROM inserted_book
		WHERE inserted_book.id IS NOT NULL
		ON CONFLICT DO NOTHING
	`;

	return sql.transaction(
		batch.map((book) => {
			const authorIds = (book.authors ?? [])
				.map((author) => author.author_id)
				.filter((authorId) => authorId !== '' && authorId != null);

			return sql.query(insertBookAndAuthorsQuery, [
				parseInt(book.book_id),
				book.isbn || null,
				book.title,
				book.publication_year ? parseInt(book.publication_year) : null,
				book.publisher || null,
				book.image_url || null,
				book.description || null,
				book.num_pages ? parseInt(book.num_pages) : null,
				book.language_code || null,
				book.ratings_count ? parseInt(book.ratings_count) : null,
				book.average_rating ? book.average_rating : null,
				authorIds
			]);
		})
	);
}

async function main() {
	try {
		await sql`CREATE EXTENSION IF NOT EXISTS unaccent`;

		const bookCount = await processEntities<BookData>(
			DATA_FILE,
			CHECKPOINT_FILE,
			BATCH_SIZE,
			batchInsertBooks,
			sql,
			TOTAL_BOOKS
		);
		await sql`SELECT setval(pg_get_serial_sequence('books', 'id'), (SELECT max(id) FROM books))`;
		console.log(`Seeded ${bookCount.toLocaleString()} / ${TOTAL_BOOKS.toLocaleString()} books`);
	} catch (error) {
		console.error('Error seeding books:', error);
		process.exitCode = 1;
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

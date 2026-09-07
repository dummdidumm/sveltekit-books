import { and, count, eq, gte, isNull, lte, not, sql } from 'drizzle-orm';
import { DATABASE_URL } from '$app/env/private';
import { EMPTY_IMAGE_URL, ITEMS_PER_PAGE, MIN_RATING, MIN_YEAR } from '#lib/books/constants.ts';
import type { BookDetails, BookMeta, BookSummary } from '#lib/books/types.ts';
import type { BookFilters, BookQuery } from '#lib/books/utils.ts';
import { getDb } from './db';
import { authors, books, bookToAuthor } from './db/schema';
import { cached, DAY, HOUR } from './cache';
import {
	getPreviewBookDetails,
	getPreviewBookMeta,
	getPreviewBooksCount,
	getPreviewBooksPage,
	getPreviewCatalogSize
} from './preview-catalog';

// Without a DATABASE_URL there is nothing to connect to, so queries are served
// from the generated preview catalog instead of the database.
const usePreviewCatalog = !DATABASE_URL;

const yearFilter = (year: number) =>
	and(gte(books.publication_year, MIN_YEAR), lte(books.publication_year, year));

const ratingFilter = (rating: number) =>
	rating > MIN_RATING ? sql`${books.average_rating} >= ${rating}` : undefined;

const languageFilter = (language: string) => {
	if (!language) return undefined;
	if (language === 'en') return sql`${books.language_code} IN ('eng', 'en-US', 'en-GB')`;
	return eq(books.language_code, language);
};

const pageCountFilter = (maxPages: number) => lte(books.num_pages, maxPages);

const imageFilter = () =>
	and(not(isNull(books.image_url)), sql`${books.image_url} != ${EMPTY_IMAGE_URL}`);

const searchFilter = (search: string) =>
	search
		? sql`to_tsvector('english', ${books.title_tsv}) @@ plainto_tsquery('english', unaccent(${search}))`
		: undefined;

const isbnFilter = (isbns: string) => {
	if (!isbns) return undefined;
	const values = isbns.split(',').map((value) => value.trim());
	return sql`${books.isbn} IN (${sql.join(
		values.map((value) => sql`${value}`),
		sql`, `
	)})`;
};

function getWhereClause({ isbns, language, maxPages, rating, search, year }: BookFilters) {
	const filters = [
		yearFilter(year),
		ratingFilter(rating),
		languageFilter(language),
		pageCountFilter(maxPages),
		imageFilter(),
		searchFilter(search),
		isbnFilter(isbns)
	].filter((filter) => filter !== undefined);

	return filters.length ? and(...filters) : undefined;
}

export async function getBooksPage(query: BookQuery): Promise<BookSummary[]> {
	if (usePreviewCatalog) return getPreviewBooksPage(query);
	return cached(`books:page:${JSON.stringify(query)}`, HOUR, () =>
		getDb()
			.select({
				id: books.id,
				image_url: books.image_url,
				thumbhash: books.thumbhash,
				title: books.title
			})
			.from(books)
			.where(getWhereClause(query))
			.orderBy(books.id)
			.limit(ITEMS_PER_PAGE)
			.offset((query.page - 1) * ITEMS_PER_PAGE)
	);
}

export async function getBooksCount(filters: BookFilters): Promise<number> {
	if (usePreviewCatalog) return getPreviewBooksCount(filters);
	return cached(`books:count:${JSON.stringify(filters)}`, HOUR, async () => {
		const [{ total }] = await getDb()
			.select({ total: count() })
			.from(books)
			.where(getWhereClause(filters));
		return total;
	});
}

export async function getBookMeta(id: number): Promise<BookMeta | null> {
	if (usePreviewCatalog) return getPreviewBookMeta(id);
	return cached(`book:meta:${id}`, HOUR, async () => {
		const result = await getDb()
			.select({ id: books.id, title: books.title, description: books.description })
			.from(books)
			.where(eq(books.id, id))
			.limit(1);
		return result[0] ?? null;
	});
}

export async function getBookDetails(id: number): Promise<BookDetails | null> {
	if (usePreviewCatalog) return getPreviewBookDetails(id);
	return cached(`book:details:${id}`, HOUR, async () => {
		const result = await getDb()
			.select({
				authors: sql<string[]>`array_remove(array_agg(${authors.name}), NULL)`,
				average_rating: books.average_rating,
				description: books.description,
				id: books.id,
				image_url: books.image_url,
				isbn: books.isbn,
				language_code: books.language_code,
				num_pages: books.num_pages,
				publication_year: books.publication_year,
				publisher: books.publisher,
				ratings_count: books.ratings_count,
				thumbhash: books.thumbhash,
				title: books.title
			})
			.from(books)
			.leftJoin(bookToAuthor, eq(books.id, bookToAuthor.bookId))
			.leftJoin(authors, eq(bookToAuthor.authorId, authors.id))
			.where(eq(books.id, id))
			.groupBy(books.id)
			.limit(1);

		return result[0] ?? null;
	});
}

export async function getCatalogSize(): Promise<number> {
	if (usePreviewCatalog) return getPreviewCatalogSize();
	return cached(`catalog:size`, DAY, async () => {
		const [{ total }] = await getDb().select({ total: count() }).from(books);
		return total;
	});
}

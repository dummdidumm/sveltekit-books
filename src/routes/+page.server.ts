import { parseSearchParams } from '#lib/books/url-state.ts';
import { toBookFilters, toBookQuery } from '#lib/books/utils.ts';
import { getBooksCount, getBooksPage } from '#lib/server/books.ts';
import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
	const searchParams = parseSearchParams(url.searchParams);
	const query = toBookQuery(searchParams);

	// Both promises stream to the client. The no-op handlers keep the server from
	// logging unhandled rejections when the streams fail after the response starts.
	const books = getBooksPage(query);
	books.catch(() => {});
	const total = getBooksCount(toBookFilters(query));
	total.catch(() => {});

	return { books, searchParams, total };
}) satisfies PageServerLoad;

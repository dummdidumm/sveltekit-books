import { error } from '@sveltejs/kit';
import { getBookDetails, getBookMeta } from '#lib/server/books.ts';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	const details = getBookDetails(id);
	details.catch(() => {});
	const meta = await getBookMeta(id);
	if (!meta) error(404, 'Book not found');
	return {
		meta,
		details: details.then((book) => {
			if (!book) error(404, 'Book not found');
			return book;
		})
	};
}) satisfies PageServerLoad;

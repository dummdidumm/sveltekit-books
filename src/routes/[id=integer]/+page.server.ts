import { error } from '@sveltejs/kit';
import { getBookDetails } from '#lib/server/books.ts';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, setHeaders }) => {
	const id = Number(params.id);
	const details = await getBookDetails(id);
	if (!details) error(404, 'Book not found');

	setHeaders({
		'Cache-Control': 'public, max-age=600'
	});

	return {
		details
	};
}) satisfies PageServerLoad;

import { error } from '@sveltejs/kit';
import { getBookDetails } from '#lib/server/books.ts';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);
	const details = await getBookDetails(id);
	if (!details) error(404, 'Book not found');
	return {
		details
	};
}) satisfies PageServerLoad;

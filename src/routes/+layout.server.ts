import { getCatalogSize } from '#lib/server/books.ts';

export const load = async () => {
	try {
		return { catalogSize: await getCatalogSize() };
	} catch (error) {
		// A missing or unreachable database only hides the count; the shell still renders.
		console.error('Failed to load catalog size:', error);
		return { catalogSize: 0 };
	}
};

import { EMPTY_IMAGE_URL, ITEMS_PER_PAGE, MIN_RATING, MIN_YEAR } from '#lib/books/constants.ts';
import type { BookDetails, BookMeta, BookSummary } from '#lib/books/types.ts';
import type { BookFilters, BookQuery } from '#lib/books/utils.ts';
import { SAMPLE_BOOKS } from './sample-books';

const COVERS = [
	'https://images.gr-assets.com/books/1310220028m/5333265.jpg',
	'https://images.gr-assets.com/books/1304100136m/7327624.jpg'
];

const TITLE_PREFIX = [
	'The Silent',
	'A Brief History of the',
	'Notes on the',
	'The Long',
	'Small',
	'The Quiet',
	'After the',
	'The Second',
	'Letters from the',
	'The Hollow',
	'Field Notes on the',
	'The Paper'
];

const TITLE_SUFFIX = [
	'Archive',
	'Cartographers',
	'Harbor',
	'Almanac',
	'Observatory',
	'Inventory',
	'Migration',
	'Meridian',
	'Catalogue',
	'Foundry',
	'Aperture',
	'Reservoir'
];

const AUTHOR_NAMES = [
	'Mara Ellison',
	'Tomas Vance',
	'Ines Okafor',
	'Rafael Lindqvist',
	'Noor Haddad',
	'Greta Sandoval',
	'Yusuf Beringer',
	'Clara Nakamura',
	'Emil Draper',
	'Sofia Marchetti'
];

const PUBLISHERS = [
	'Northgate Press',
	'Alder & Vine',
	'Meridian House',
	'Coldwater Books',
	'Halcyon Editions'
];

// A generated, in-memory catalog so the app has a browsable, paginated shelf
// without a database connection (e.g. local dev or preview deployments).
const GENERATED_PREVIEW_BOOKS: BookDetails[] = Array.from({ length: 44 }, (_, index) => {
	const prefix = TITLE_PREFIX[index % TITLE_PREFIX.length];
	const suffix = TITLE_SUFFIX[(index * 5 + 3) % TITLE_SUFFIX.length];

	return {
		authors: [AUTHOR_NAMES[index % AUTHOR_NAMES.length]],
		average_rating: (3 + ((index * 7) % 20) / 10).toFixed(2),
		description:
			'A generated entry in the preview catalog, used so the app has a browsable, paginated shelf without a database connection.',
		id: 900_001 + index,
		image_url: COVERS[index % COVERS.length],
		isbn: `978000000${String(index).padStart(4, '0')}`,
		language_code: 'eng',
		num_pages: 180 + ((index * 37) % 620),
		publication_year: 1962 + ((index * 13) % 60),
		publisher: PUBLISHERS[index % PUBLISHERS.length],
		ratings_count: 120 + index * 431,
		thumbhash: null,
		title: `${prefix} ${suffix}`
	};
});

const previewBooks: BookDetails[] = [...SAMPLE_BOOKS, ...GENERATED_PREVIEW_BOOKS];

function matchesFilters(book: BookDetails, filters: BookFilters): boolean {
	if (
		!book.publication_year ||
		book.publication_year < MIN_YEAR ||
		(filters.year && book.publication_year > filters.year)
	) {
		return false;
	}

	if (filters.rating > MIN_RATING && Number(book.average_rating) < filters.rating) {
		return false;
	}

	if (filters.language) {
		const code = book.language_code?.toLowerCase() ?? '';
		const isEnglish =
			filters.language === 'en'
				? ['eng', 'en-us', 'en-gb'].includes(code)
				: code === filters.language;
		if (!isEnglish) return false;
	}

	if (filters.maxPages && book.num_pages && book.num_pages > filters.maxPages) {
		return false;
	}

	if (!book.image_url || book.image_url === EMPTY_IMAGE_URL) {
		return false;
	}

	if (filters.search && !book.title.toLowerCase().includes(filters.search.toLowerCase())) {
		return false;
	}

	if (filters.isbns) {
		const values = filters.isbns.split(',').map((value) => value.trim());
		if (!book.isbn || !values.includes(book.isbn)) return false;
	}

	return true;
}

function filterPreviewBooks(filters: BookFilters): BookDetails[] {
	return previewBooks.filter((book) => matchesFilters(book, filters));
}

function toSummary(book: BookDetails): BookSummary {
	return {
		id: book.id,
		image_url: book.image_url,
		thumbhash: book.thumbhash,
		title: book.title
	};
}

function toMeta(book: BookDetails): BookMeta {
	return {
		id: book.id,
		title: book.title,
		description: book.description
	};
}

export function getPreviewBooksPage(query: BookQuery): BookSummary[] {
	return filterPreviewBooks(query)
		.slice((query.page - 1) * ITEMS_PER_PAGE, query.page * ITEMS_PER_PAGE)
		.map(toSummary);
}

export function getPreviewBooksCount(filters: BookFilters): number {
	return filterPreviewBooks(filters).length;
}

export function getPreviewBookMeta(id: number): BookMeta | null {
	const book = previewBooks.find((entry) => entry.id === id);
	return book ? toMeta(book) : null;
}

export function getPreviewBookDetails(id: number): BookDetails | null {
	return previewBooks.find((entry) => entry.id === id) ?? null;
}

export function getPreviewCatalogSize(): number {
	return previewBooks.length;
}

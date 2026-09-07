export type BookSummary = {
	id: number;
	title: string;
	image_url: string | null;
	thumbhash: string | null;
};

export type BookMeta = {
	id: number;
	title: string;
	description: string | null;
};

export type BookDetails = BookSummary & {
	isbn: string | null;
	publisher: string | null;
	description: string | null;
	num_pages: number | null;
	language_code: string | null;
	ratings_count: number | null;
	publication_year: number | null;
	average_rating: string | null;
	authors: string[];
};

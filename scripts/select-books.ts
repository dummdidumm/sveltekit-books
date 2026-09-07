import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { createGunzip } from 'zlib';
import { EMPTY_IMAGE_URL, LANGUAGES, LISTS, MAX_YEAR, MIN_YEAR } from '../src/lib/books/constants';

const DATA_FILE = path.resolve(process.env.BOOKS_DATA_PATH ?? './data/books.json.gz');
const OUTPUT_FILE = path.resolve('./data/selected-books.ndjson');
const AUTHOR_IDS_FILE = path.resolve('./data/author-ids.json');

// https://mcauleylab.ucsd.edu/public_datasets/gdrive/goodreads/goodreads_books.json.gz
const MAX_BOOKS = Number(process.env.MAX_BOOKS ?? 100000);

interface BookData {
	book_id: string;
	isbn: string | null;
	title: string;
	authors: { author_id: string }[];
	publication_year: string | null;
	image_url: string | null;
	language_code: string | null;
	ratings_count: string | null;
}

interface Candidate {
	id: number;
	ratings: number;
	isbn: string | null;
}

function openStream(filePath: string): NodeJS.ReadableStream {
	const fileStream = fs.createReadStream(filePath);
	return filePath.endsWith('.gz') ? fileStream.pipe(createGunzip()) : fileStream;
}

function isCandidate(book: BookData, languageCodes: Set<string>): boolean {
	if (!book.image_url || book.image_url === EMPTY_IMAGE_URL) return false;
	if (!book.title) return false;
	if (!book.language_code || !languageCodes.has(book.language_code)) return false;
	const year = book.publication_year ? parseInt(book.publication_year) : NaN;
	if (Number.isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) return false;
	return true;
}

async function main() {
	const startTime = Date.now();

	const languageCodes = new Set([...LANGUAGES.map((lang) => lang.value), 'eng', 'en-US', 'en-GB']);

	// Every ISBN that appears in a curated list, so those books are force-included
	// even if they would not make the top-N by ratings.
	const listIsbns = new Set<string>();
	for (const list of LISTS) {
		for (const isbn of list.isbns.split(',')) {
			const trimmed = isbn.trim();
			if (trimmed) listIsbns.add(trimmed);
		}
	}

	console.log(`Pass 1: scanning ${DATA_FILE} for candidates...`);

	const candidates: Candidate[] = [];
	let totalLines = 0;

	const rl1 = readline.createInterface({ crlfDelay: Infinity, input: openStream(DATA_FILE) });
	for await (const line of rl1) {
		totalLines++;
		let book: BookData;
		try {
			book = JSON.parse(line) as BookData;
		} catch {
			continue;
		}
		if (!isCandidate(book, languageCodes)) continue;
		candidates.push({
			id: parseInt(book.book_id),
			ratings: parseInt(book.ratings_count || '0'),
			isbn: book.isbn || null
		});
	}

	console.log(
		`Scanned ${totalLines.toLocaleString()} books, ${candidates.length.toLocaleString()} candidates.`
	);

	const selectedIds = new Set<number>();

	candidates.sort((a, b) => b.ratings - a.ratings);
	for (const candidate of candidates.slice(0, MAX_BOOKS)) {
		selectedIds.add(candidate.id);
	}
	for (const candidate of candidates) {
		if (candidate.isbn && listIsbns.has(candidate.isbn)) {
			selectedIds.add(candidate.id);
		}
	}

	console.log(`Selected ${selectedIds.size.toLocaleString()} books. Pass 2: writing output...`);

	fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
	const output = fs.createWriteStream(OUTPUT_FILE, { encoding: 'utf8' });

	const authorIds = new Set<string>();
	let written = 0;

	const rl2 = readline.createInterface({ crlfDelay: Infinity, input: openStream(DATA_FILE) });
	for await (const line of rl2) {
		let book: BookData;
		try {
			book = JSON.parse(line) as BookData;
		} catch {
			continue;
		}
		if (!selectedIds.has(parseInt(book.book_id))) continue;

		if (!output.write(`${line}\n`)) {
			await new Promise<void>((resolve) => output.once('drain', resolve));
		}
		written++;
		for (const author of book.authors ?? []) {
			if (author.author_id) authorIds.add(author.author_id);
		}
	}

	output.end();
	await new Promise<void>((resolve, reject) => {
		output.on('error', reject);
		output.on('finish', () => resolve());
	});

	await fs.promises.writeFile(AUTHOR_IDS_FILE, JSON.stringify([...authorIds]), 'utf8');

	const totalSeconds = (Date.now() - startTime) / 1000;
	console.log(
		`Wrote ${written.toLocaleString()} books and ${authorIds.size.toLocaleString()} author ids in ${(totalSeconds / 60).toFixed(2)} minutes.`
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

import path from 'path';
import sharp from 'sharp';
import * as ThumbHash from 'thumbhash';
import { EMPTY_IMAGE_URL } from '../src/lib/books/constants';
import { sql } from './db';
import { processEntities } from './seed-utils';

const BATCH_SIZE = 900;
const DATA_FILE = path.resolve('./data/selected-books.ndjson');
const CHECKPOINT_FILE = path.resolve(
	process.env.THUMBHASH_CHECKPOINT_PATH ?? 'thumbhash_checkpoint.json'
);
const TOTAL_BOOKS = Number(process.env.TOTAL_BOOKS ?? 100000);
const CONCURRENCY_LIMIT = 10;

interface BookData {
	image_url: string | null;
}

// Minimal inlined replacement for p-limit.
function createLimiter(concurrency: number) {
	let active = 0;
	const queue: (() => void)[] = [];

	const next = () => {
		if (active >= concurrency) return;
		const run = queue.shift();
		if (!run) return;
		active++;
		run();
	};

	return function limit<T>(task: () => Promise<T>): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			queue.push(() => {
				task()
					.then(resolve, reject)
					.finally(() => {
						active--;
						next();
					});
			});
			next();
		});
	};
}

const limit = createLimiter(CONCURRENCY_LIMIT);

async function fetchImage(url: string): Promise<Buffer | null> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			console.error(`Failed to fetch image: ${url} - Status: ${response.status}`);
			return null;
		}
		return Buffer.from(await response.arrayBuffer());
	} catch (error) {
		console.error(`Error fetching image: ${url}`, error);
		return null;
	}
}

async function generateThumbHash(imageBuffer: Buffer): Promise<string | null> {
	try {
		const { data, info } = await sharp(imageBuffer)
			.resize(100, 100, { fit: 'inside' })
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true });

		const binaryThumbHash = ThumbHash.rgbaToThumbHash(info.width, info.height, data);
		return Buffer.from(binaryThumbHash).toString('base64');
	} catch (error) {
		console.error('Error generating thumbhash:', error);
		return null;
	}
}

async function processBook(book: BookData): Promise<[string, string] | null> {
	if (book.image_url && book.image_url !== EMPTY_IMAGE_URL) {
		const imageBuffer = await fetchImage(book.image_url);
		if (imageBuffer) {
			const thumbHash = await generateThumbHash(imageBuffer);
			if (thumbHash) {
				return [thumbHash, book.image_url];
			}
		}
	}
	return null;
}

async function batchUpdateThumbHash(batch: BookData[]) {
	const updateThumbhashQuery = `
		UPDATE books
		SET thumbhash = $1
		WHERE image_url = $2
	`;

	const processedBooks = await Promise.all(batch.map((book) => limit(() => processBook(book))));

	const queries = processedBooks
		.filter((result): result is [string, string] => result !== null)
		.map(([thumbHash, imageUrl]) => sql.query(updateThumbhashQuery, [thumbHash, imageUrl]));

	return sql.transaction(queries);
}

async function main() {
	try {
		const bookCount = await processEntities<BookData>(
			DATA_FILE,
			CHECKPOINT_FILE,
			BATCH_SIZE,
			batchUpdateThumbHash,
			sql,
			TOTAL_BOOKS
		);
		console.log(
			`Updated thumbhash for ${bookCount.toLocaleString()} / ${TOTAL_BOOKS.toLocaleString()} books`
		);
	} catch (error) {
		console.error('Error updating thumbhash:', error);
		process.exitCode = 1;
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

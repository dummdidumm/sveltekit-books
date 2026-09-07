import { getCache } from '@vercel/functions';

const CACHE_VERSION = 'v1';

// Outside Vercel, getCache() falls back to an in-process InMemoryCache, so dev still caches.
// On Hobby the runtime cache is shared team-wide, hence the namespace.
const cache = getCache({ namespace: 'sveltekit-books' });

export const HOUR = 3600;
export const DAY = 86400;

export async function cached<T>(
	key: string,
	ttl: number,
	fn: () => Promise<T>,
	tags: string[] = ['books']
): Promise<T> {
	const fullKey = `${CACHE_VERSION}:${key}`;

	let value: unknown;
	try {
		value = await cache.get(fullKey);
	} catch (error) {
		console.error(`cache get failed for key "${key}"`, error);
	}

	if (value !== null && value !== undefined) return value as T;

	// Never cache failures: if `fn` rejects, the error propagates to the caller.
	const fresh = await fn();

	try {
		await cache.set(fullKey, fresh, { ttl, tags, name: key });
	} catch (error) {
		console.error(`cache set failed for key "${key}"`, error);
	}

	return fresh;
}

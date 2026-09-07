import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { DATABASE_URL } from '$app/env/private';

type Database = ReturnType<typeof create>;

let instance: Database | undefined;

function create() {
	if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
	return drizzle(neon(DATABASE_URL), { schema });
}

// Lazily created so importing server modules never throws at module-init time
// (e.g. during the build's analysis step or when the env var is a placeholder).
export function getDb(): Database {
	return (instance ??= create());
}

import { defineParams } from '@sveltejs/kit/params';

// Kit 3 consumes a single `src/params` entry exporting `params` (see
// `defineParams`); the legacy per-file `export const match` layout is gone.
// A matcher must return the param (or undefined to reject), not a boolean.
export const params = defineParams({
	integer: (param) => {
		if (!/^\d+$/.test(param)) return;
		return param;
	}
});

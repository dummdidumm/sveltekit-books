import { browser } from '$app/env';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

function applyToDocument(next: Theme) {
	if (!browser) return;
	const dark =
		next === 'dark' ||
		(next === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
	document.documentElement.classList.toggle('dark', dark);
	document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

// switching palettes shouldn't animate every transition on the page.
function withoutTransitions(apply: () => void) {
	const style = document.createElement('style');
	style.textContent = '*{transition:none!important}';
	document.head.appendChild(style);
	apply();
	requestAnimationFrame(() => style.remove());
}

function createTheme() {
	let current = $state<Theme>('system');
	let mounted = $state(false);

	function set(next: Theme) {
		current = next;
		if (!browser) return;
		try {
			if (next === 'system') localStorage.removeItem(STORAGE_KEY);
			else localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Storage unavailable (private mode, etc.) — still apply the theme.
		}
		withoutTransitions(() => applyToDocument(next));
	}

	function init() {
		if (!browser || mounted) return;
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			current = stored === 'light' || stored === 'dark' ? stored : 'system';
		} catch {
			current = 'system';
		}
		applyToDocument(current);

		const media = window.matchMedia('(prefers-color-scheme: dark)');
		media.addEventListener('change', () => {
			if (current === 'system') applyToDocument('system');
		});

		mounted = true;
	}

	return {
		get value() {
			return current;
		},
		get mounted() {
			return mounted;
		},
		set,
		init
	};
}

export const theme = createTheme();

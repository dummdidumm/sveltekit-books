<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import geist from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';
	import geistMono from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url';
	import { afterNavigate } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import { theme } from '#lib/theme.svelte.ts';
	import BookSearch from '#lib/components/book/BookSearch.svelte';
	import MobileSidebar from '#lib/components/shell/MobileSidebar.svelte';
	import OfflineToast from '#lib/components/shell/OfflineToast.svelte';
	import Sidebar from '#lib/components/shell/Sidebar.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	let mobileOpen = $state(false);

	$effect(() => {
		theme.init();
	});

	afterNavigate(() => {
		mobileOpen = false;
	});

	const UNICODE_RANGE =
		'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

	// `<style>` contents are raw text in Svelte, so the URLs must be spliced in via @html.
	const fontFaces = `<style>
@font-face{font-family:'Geist Variable';font-style:normal;font-weight:100 900;font-display:block;src:url(${geist}) format('woff2-variations');unicode-range:${UNICODE_RANGE}}
@font-face{font-family:'Geist Mono Variable';font-style:normal;font-weight:100 900;font-display:block;src:url(${geistMono}) format('woff2-variations');unicode-range:${UNICODE_RANGE}}
</style>`;
</script>

<svelte:head>
	<title>SvelteBooks</title>
	<meta
		name="description"
		content="Browse Goodreads books with SvelteKit, streaming search, and URL-driven filters."
	/>
	<meta property="og:site_name" content="SvelteBooks" />
	<meta property="og:type" content="website" />

	<link rel="icon" href={favicon} />

	<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={geist} />
	<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={geistMono} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, build-time asset URLs -->
	{@html fontFaces}
</svelte:head>

<MobileSidebar bind:open={mobileOpen}>
	<Sidebar idPrefix="mobile" mobile catalogSize={data.catalogSize} />
</MobileSidebar>

<div class="group flex min-h-dvh">
	<aside
		class="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r border-divider bg-surface px-5 py-5 md:flex dark:border-divider-dark dark:bg-surface-dark"
	>
		<Sidebar idPrefix="desktop" catalogSize={data.catalogSize} />
	</aside>

	<div class="flex min-w-0 flex-1 flex-col">
		<header
			class="sticky top-0 z-20 flex items-center gap-2 border-b border-divider bg-surface/80 px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:gap-3 sm:px-6 dark:border-divider-dark dark:bg-surface-dark/80"
		>
			<Button
				aria-label="Open filters"
				class="md:hidden"
				size="icon"
				variant="ghost"
				onclick={() => (mobileOpen = true)}
			>
				<SlidersHorizontal class="size-4" />
			</Button>
			<BookSearch />
		</header>

		<main class="flex min-w-0 flex-1 flex-col">
			{@render children()}
		</main>
	</div>
</div>

<OfflineToast />

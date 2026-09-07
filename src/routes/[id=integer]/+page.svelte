<script lang="ts">
	import BookDetail from '#lib/components/book/BookDetail.svelte';
	import { page } from '$app/state';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { buildHref, parseSearchParams } from '#lib/books/url-state.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const backHref = $derived(buildHref(parseSearchParams(page.url.searchParams)));
</script>

<svelte:head>
	<title>{data.details.title} · SvelteBooks</title>
	{#if data.details.description}<meta name="description" content={data.details.description} />{/if}
	<meta property="og:title" content={data.details.title} />
</svelte:head>

<div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
	<a
		href={backHref}
		class="mb-6 -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white"
	>
		<ArrowLeft aria-hidden="true" class="size-4" />
		Back to books
	</a>

	<div>
		<BookDetail book={data.details} />
	</div>
</div>

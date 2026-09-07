<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { BookSummary } from '#lib/books/types.ts';
	import { buildHref, type SearchParams } from '#lib/books/url-state.ts';
	import { fastLink } from '#lib/attachments/fast-link.ts';
	import BookCover from './BookCover.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';

	let { books, searchParams }: { books: BookSummary[]; searchParams: SearchParams } = $props();
</script>

{#if books.length === 0}
	<EmptyState
		title="No books found"
		body="Nothing matched these filters. Try widening the year range or clearing the search."
	/>
{:else}
	<div
		class="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
		in:fade={{ duration: 150 }}
	>
		{#each books as book, index (book.id)}
			{const back = $derived(buildHref(searchParams))}
			{const href = $derived(back === '/' ? `/${book.id}` : `/${book.id}?${back.slice(2)}`)}
			<a
				{href}
				{@attach fastLink()}
				class="group relative block rounded-md transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none dark:focus-visible:ring-offset-surface-dark"
			>
				<BookCover
					class="transition-shadow group-hover:shadow-soft"
					priority={index < 10}
					sizes="(min-width: 1280px) 14vw, (min-width: 1024px) 16vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 33vw"
					src={book.image_url}
					thumbhash={book.thumbhash}
					title={book.title}
				/>
				<span class="sr-only">{book.title}</span>
			</a>
		{/each}
	</div>
{/if}

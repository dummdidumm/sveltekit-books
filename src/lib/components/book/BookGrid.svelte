<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { BookSummary } from '#lib/books/types.ts';
	import type { SearchParams } from '#lib/books/url-state.ts';
	import BookCard from './BookCard.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';

	const gridClass =
		'grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7';

	let { books, searchParams }: { books: BookSummary[]; searchParams: SearchParams } = $props();
</script>

{#if books.length === 0}
	<EmptyState
		title="No books found"
		body="Nothing matched these filters. Try widening the year range or clearing the search."
	/>
{:else}
	<div class={gridClass} in:fade={{ duration: 150 }}>
		{#each books as book, index (book.id)}
			<BookCard {book} priority={index < 10} {searchParams} />
		{/each}
	</div>
{/if}

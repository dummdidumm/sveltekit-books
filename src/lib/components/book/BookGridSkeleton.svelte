<script lang="ts">
	import { ITEMS_PER_PAGE } from '#lib/books/constants.ts';
	import BookCoverSkeleton from './BookCoverSkeleton.svelte';

	const gridClass =
		'grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7';

	let { count = ITEMS_PER_PAGE }: { count?: number } = $props();
</script>

<div aria-hidden="true" class={gridClass}>
	{#each Array.from({ length: count }) as _, index (index)}
		<BookCoverSkeleton />
	{/each}
</div>

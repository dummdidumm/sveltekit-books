<script lang="ts">
	import { refreshAll } from '$app/navigation';
	import BookGrid from '#lib/components/book/BookGrid.svelte';
	import BookGridSkeleton from '#lib/components/book/BookGridSkeleton.svelte';
	import BookPagination from '#lib/components/book/BookPagination.svelte';
	import BookPaginationSkeleton from '#lib/components/book/BookPaginationSkeleton.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import ErrorState from '#lib/components/ui/ErrorState.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex min-h-0 flex-1 flex-col">
	<div
		class="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6"
	>
		{#await data.books}
			<BookGridSkeleton />
		{:then books}
			<BookGrid {books} searchParams={data.searchParams} />
		{:catch}
			<ErrorState
				title="Can't load books"
				body="The catalog query failed. Check your database connection and try again."
			>
				<Button size="sm" variant="secondary" onclick={() => refreshAll()}>Try again</Button>
			</ErrorState>
		{/await}
	</div>
	<footer class="mt-auto border-t border-divider px-4 py-3 sm:px-6 dark:border-divider-dark">
		{#await data.total}
			<BookPaginationSkeleton />
		{:then total}
			<BookPagination {total} searchParams={data.searchParams} />
		{:catch}
			<BookPaginationSkeleton />
		{/await}
	</footer>
</div>

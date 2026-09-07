<script lang="ts">
	import { refreshAll } from '$app/navigation';
	import BackToBooksLink from '#lib/components/book/BackToBooksLink.svelte';
	import BookDetail from '#lib/components/book/BookDetail.svelte';
	import BookDetailSkeleton from '#lib/components/book/BookDetailSkeleton.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import ErrorState from '#lib/components/ui/ErrorState.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.meta.title} · SvelteBooks</title>
	{#if data.meta.description}<meta name="description" content={data.meta.description} />{/if}
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
	<BackToBooksLink class="mb-6" />
	<div>
		{#await data.details}
			<BookDetailSkeleton />
		{:then book}
			<BookDetail {book} />
		{:catch}
			<ErrorState title="Can't load book" body="We couldn't load this book's details.">
				<Button size="sm" variant="secondary" onclick={() => refreshAll()}>Try again</Button>
			</ErrorState>
		{/await}
	</div>
</div>

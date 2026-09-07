<script lang="ts">
	import BookDetail from '#lib/components/book/BookDetail.svelte';
	import { goto } from '$app/navigation';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function backToBooks() {
		if (window.navigation?.canGoBack) {
			history.back();
		} else {
			void goto('/');
		}
	}
</script>

<svelte:head>
	<title>{data.details.title} · SvelteBooks</title>
	{#if data.details.description}<meta name="description" content={data.details.description} />{/if}
	<meta property="og:title" content={data.details.title} />
</svelte:head>

<div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
	<button
		type="button"
		class="mb-6 -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white"
		onclick={backToBooks}
	>
		<ArrowLeft aria-hidden="true" class="size-4" />
		Back to books
	</button>

	<div>
		<BookDetail book={data.details} />
	</div>
</div>

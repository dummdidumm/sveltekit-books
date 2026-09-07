<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import {
		buildHref,
		getCurrentPage,
		getTotalPages,
		withPage,
		type SearchParams
	} from '#lib/books/url-state.ts';
	import LinkStatus from '#lib/components/ui/LinkStatus.svelte';
	import { fastLink } from '#lib/attachments/fast-link.ts';

	const stepClass =
		'text-muted hover:bg-card dark:hover:bg-card-dark focus-visible:ring-action/40 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white';

	let { total, searchParams }: { total: number; searchParams: SearchParams } = $props();

	const totalPages = $derived(getTotalPages(total));
	const currentPage = $derived(getCurrentPage(searchParams, totalPages));
	const hasPrevious = $derived(currentPage > 1);
	const hasNext = $derived(currentPage < totalPages);
	const previousHref = $derived(buildHref(withPage(searchParams, currentPage - 1)));
	const nextHref = $derived(buildHref(withPage(searchParams, currentPage + 1)));
</script>

<nav aria-label="Pagination" class="flex items-center justify-between gap-4">
	{#if hasPrevious}
		<a
			class={stepClass}
			href={previousHref}
			aria-label="Previous page"
			data-sveltekit-preload-data="viewport"
			{@attach fastLink()}
		>
			<LinkStatus href={previousHref}>
				<ChevronLeft aria-hidden="true" class="size-4" />
				Previous
			</LinkStatus>
		</a>
	{:else}
		<span aria-disabled="true" class={[stepClass, 'pointer-events-none opacity-40']}>
			<ChevronLeft aria-hidden="true" class="size-4" />
			Previous
		</span>
	{/if}

	<p class="flex items-center gap-2 text-xs text-muted tabular-nums sm:text-sm">
		<span class="hidden sm:inline">
			<span class="font-medium text-black dark:text-white">{total.toLocaleString()}</span> books
		</span>
		<span aria-hidden="true" class="hidden h-3 w-px bg-divider sm:block dark:bg-divider-dark"
		></span>
		<span>
			Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
		</span>
	</p>

	{#if hasNext}
		<a
			class={stepClass}
			href={nextHref}
			aria-label="Next page"
			data-sveltekit-preload-data="viewport"
			{@attach fastLink()}
		>
			<LinkStatus href={nextHref} hint="start">
				Next
				<ChevronRight aria-hidden="true" class="size-4" />
			</LinkStatus>
		</a>
	{:else}
		<span aria-disabled="true" class={[stepClass, 'pointer-events-none opacity-40']}>
			Next
			<ChevronRight aria-hidden="true" class="size-4" />
		</span>
	{/if}
</nav>

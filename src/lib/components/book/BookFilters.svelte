<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import {
		LANGUAGES,
		LISTS,
		MAX_PAGES,
		MAX_RATING,
		MAX_YEAR,
		MIN_PAGES,
		MIN_RATING,
		MIN_YEAR,
		PAGE_FILTER_VALUES,
		RATING_FILTER_VALUES,
		YEAR_FILTER_VALUES
	} from '#lib/books/constants.ts';
	import {
		buildHref,
		parseSearchParams,
		withFilters,
		type SearchParams
	} from '#lib/books/url-state.ts';
	import Button from '#lib/components/ui/Button.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Range from '#lib/components/ui/Range.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	type Props = {
		idPrefix: string;
	};

	let { idPrefix }: Props = $props();

	// Writable derived: `commit` assigns optimistically so the UI reflects the
	// patch before SvelteKit finishes navigating.
	let filters = $derived(parseSearchParams(page.url.searchParams));

	const isPending = $derived(!!navigating.to && navigating.to.url.pathname === '/');

	const activeCount = $derived(
		Object.entries(filters).filter(([key, value]) => key !== 'page' && Boolean(value)).length
	);

	function commit(patch: Partial<SearchParams>) {
		const next = withFilters(filters, patch);
		filters = next;
		goto(buildHref(next), { replace: true, reset: false });
	}

	function toggleList(slug: string) {
		commit({ list: filters.list === slug ? undefined : slug });
	}

	function clearAll() {
		filters = {};
		goto('/', { replace: true, reset: false });
	}
</script>

<div class="flex min-h-0 flex-1 flex-col" data-filtering={isPending ? '' : undefined}>
	<div
		class="min-h-0 flex-1 touch-pan-y [scrollbar-gutter:stable] overflow-x-hidden overflow-y-auto overscroll-contain px-1 pb-6"
	>
		<div class="flex flex-col gap-6">
			<Range
				id={`${idPrefix}-filter-year`}
				label="Published before"
				onValueChange={(value) => commit({ year: value === MAX_YEAR ? undefined : String(value) })}
				readout={filters.year ? filters.year : 'Any year'}
				value={Number(filters.year ?? MAX_YEAR)}
				values={YEAR_FILTER_VALUES}
				formatReadout={(v) => (v === MAX_YEAR ? 'Any year' : String(v))}
			>
				{#snippet hint()}
					<span>{MIN_YEAR}</span>
					<span>{MAX_YEAR}</span>
				{/snippet}
			</Range>

			<Range
				id={`${idPrefix}-filter-rating`}
				label="Minimum rating"
				onValueChange={(value) =>
					commit({ rating: value === MIN_RATING ? undefined : String(value) })}
				readout={Number(filters.rating) > 0 ? `${filters.rating}+ stars` : 'Any rating'}
				value={Number(filters.rating ?? MIN_RATING)}
				values={RATING_FILTER_VALUES}
				formatReadout={(v) => (v > 0 ? `${v}+ stars` : 'Any rating')}
			>
				{#snippet hint()}
					<span>Any</span>
					<span>{MAX_RATING} stars</span>
				{/snippet}
			</Range>

			<Range
				id={`${idPrefix}-filter-pages`}
				label="Max pages"
				onValueChange={(value) =>
					commit({ pages: value === MAX_PAGES ? undefined : String(value) })}
				readout={filters.pages ? `${Number(filters.pages).toLocaleString()} pages` : 'Any length'}
				value={Number(filters.pages ?? MAX_PAGES)}
				values={PAGE_FILTER_VALUES}
				formatReadout={(v) => (v === MAX_PAGES ? 'Any length' : `${v.toLocaleString()} pages`)}
			>
				{#snippet hint()}
					<span>{MIN_PAGES}</span>
					<span>{MAX_PAGES.toLocaleString()}</span>
				{/snippet}
			</Range>

			<div class="flex flex-col gap-2">
				<label
					class="text-xs font-semibold tracking-wide text-muted uppercase"
					for={`${idPrefix}-filter-language`}
				>
					Language
				</label>
				<Select
					id={`${idPrefix}-filter-language`}
					value={filters.language ?? 'en'}
					onchange={(event) => commit({ language: event.currentTarget.value })}
				>
					{#each LANGUAGES as language (language.value)}
						<option value={language.value}>{language.label}</option>
					{/each}
				</Select>
			</div>

			<fieldset class="flex flex-col gap-2">
				<legend class="mb-2 text-xs font-semibold tracking-wide text-muted uppercase"
					>Book lists</legend
				>
				{#each LISTS as list (list.name)}
					<label
						class="-mx-2 flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-card dark:hover:bg-card-dark"
					>
						<Input
							checked={filters.list === list.slug}
							onchange={() => toggleList(list.slug)}
							type="checkbox"
							variant="checkbox"
						/>
						{list.name}
					</label>
				{/each}
			</fieldset>
		</div>
	</div>

	{#if activeCount > 0}
		<div class="border-t border-divider pt-3 dark:border-divider-dark">
			<Button class="w-full" variant="secondary" onclick={clearAll}>Clear all filters</Button>
		</div>
	{/if}
</div>

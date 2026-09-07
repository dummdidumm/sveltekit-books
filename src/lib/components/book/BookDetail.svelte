<script lang="ts">
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Building2 from '@lucide/svelte/icons/building-2';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import Globe from '@lucide/svelte/icons/globe';
	import Hash from '@lucide/svelte/icons/hash';
	import { formatCount, getLanguageLabel } from '#lib/books/utils.ts';
	import type { BookDetails } from '#lib/books/types.ts';
	import BookCover from './BookCover.svelte';
	import Fact from './Fact.svelte';
	import StarRating from '#lib/components/ui/StarRating.svelte';

	const DETAIL_SIZES = '(min-width: 768px) 18rem, 60vw';

	let { book }: { book: BookDetails } = $props();

	const rating = $derived(Number(book.average_rating));
	const hasRating = $derived(book.average_rating !== null && !Number.isNaN(rating));
</script>

<article class="flex flex-col gap-8 md:flex-row md:gap-10">
	<div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
		<BookCover
			class="shadow-soft ring-1 ring-divider/70 dark:ring-divider-dark/70"
			priority
			sizes={DETAIL_SIZES}
			src={book.image_url}
			thumbhash={book.thumbhash}
			title={book.title}
		/>
	</div>

	<div class="min-w-0 flex-1">
		<h1>{book.title}</h1>
		{#if book.authors.length > 0}
			<p class="mt-2 text-base text-muted sm:text-lg">{book.authors.join(', ')}</p>
		{/if}

		{#if hasRating}
			<div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
				<StarRating {rating} />
				<span class="text-sm font-semibold tabular-nums">{rating.toFixed(1)}</span>
				{#if book.ratings_count}
					<span class="text-sm text-muted tabular-nums"
						>{formatCount(book.ratings_count)} ratings</span
					>
				{/if}
			</div>
		{/if}

		{#if book.description}
			<p class="mt-6 max-w-prose text-sm leading-7 text-muted">{book.description}</p>
		{/if}

		<dl
			class="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-divider pt-6 sm:grid-cols-2 dark:border-divider-dark"
		>
			<Fact icon={BookOpen} label="Pages">
				{book.num_pages ? book.num_pages.toLocaleString() : 'Unknown'}
			</Fact>
			<Fact icon={Globe} label="Language">{getLanguageLabel(book.language_code)}</Fact>
			<Fact icon={CalendarDays} label="Published">{book.publication_year ?? 'Unknown'}</Fact>
			<Fact icon={Building2} label="Publisher">{book.publisher ?? 'Unknown'}</Fact>
			<Fact icon={Hash} label="ISBN">
				<span class="font-mono text-xs">{book.isbn ?? 'None'}</span>
			</Fact>
		</dl>
	</div>
</article>

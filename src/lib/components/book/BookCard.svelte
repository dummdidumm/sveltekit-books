<script lang="ts">
	import { fastLink } from '#lib/attachments/fast-link.ts';
	import { buildHref, type SearchParams } from '#lib/books/url-state.ts';
	import type { BookSummary } from '#lib/books/types.ts';
	import BookCover from './BookCover.svelte';

	const GRID_SIZES =
		'(min-width: 1280px) 14vw, (min-width: 1024px) 16vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 33vw';

	let {
		book,
		priority,
		searchParams
	}: { book: BookSummary; priority: boolean; searchParams: SearchParams } = $props();

	const back = $derived(buildHref(searchParams));
	const href = $derived(back === '/' ? `/${book.id}` : `/${book.id}?${back.slice(2)}`);
</script>

<a
	{href}
	{@attach fastLink()}
	class="group relative block rounded-md transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none dark:focus-visible:ring-offset-surface-dark"
>
	<BookCover
		class="transition-shadow group-hover:shadow-soft"
		{priority}
		sizes={GRID_SIZES}
		src={book.image_url}
		thumbhash={book.thumbhash}
		title={book.title}
	/>
	<span class="sr-only">{book.title}</span>
</a>

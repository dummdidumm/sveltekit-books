<script lang="ts">
	import BookMark from '#lib/components/ui/BookMark.svelte';
	import GitHubIcon from '#lib/components/ui/GitHubIcon.svelte';
	import BookFilters from '#lib/components/book/BookFilters.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	type Props = {
		idPrefix: string;
		mobile?: boolean;
		catalogSize: number;
	};

	let { idPrefix, mobile = false, catalogSize }: Props = $props();
</script>

<div class="flex items-center justify-between gap-2">
	<a
		href="/"
		aria-label="SvelteBooks home"
		class="inline-flex items-center gap-2 text-base font-semibold tracking-tight"
	>
		<BookMark class="size-5 text-action" />
		SvelteBooks
	</a>
</div>
<div class="mt-6 border-b border-divider pb-5 dark:border-divider-dark">
	{const display = $derived(
		catalogSize >= 1000 ? `${Math.floor(catalogSize / 1000)}K+` : String(catalogSize)
	)}
	<div>
		<p class="text-2xl font-semibold tracking-tight tabular-nums">{display}</p>
		<p class="mt-1 text-xs leading-5 text-muted">books from Goodreads. Built on SvelteKit.</p>
	</div>
</div>
<p class="mt-5 mb-4 text-xs font-semibold tracking-wide text-muted uppercase">Filters</p>
<BookFilters {idPrefix} />
{#if !mobile}
	<div
		class="mt-4 flex items-center justify-between gap-2 border-t border-divider pt-4 dark:border-divider-dark"
	>
		<ThemeToggle variant="inline" />
		<a
			aria-label="View source on GitHub"
			class="rounded-full p-1.5 text-muted transition-colors hover:text-black dark:hover:text-white"
			href="https://github.com/sholt/sveltekit-books"
			rel="noopener noreferrer"
			target="_blank"
		>
			<GitHubIcon class="size-4" />
		</a>
	</div>
{/if}

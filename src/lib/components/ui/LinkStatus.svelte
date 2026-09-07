<script lang="ts">
	import type { Snippet } from 'svelte';
	import { navigating, page } from '$app/state';
	import Spinner from './Spinner.svelte';

	type Props = {
		href: string;
		hint?: 'end' | 'start';
		class?: string;
		children?: Snippet;
	};

	let { href, hint = 'end', class: className, children }: Props = $props();

	const hrefPathAndSearch = $derived.by(() => {
		const url = new URL(href, page.url.href);
		return url.pathname + url.search;
	});

	const pending = $derived(
		!!navigating.to && navigating.to.url.pathname + navigating.to.url.search === hrefPathAndSearch
	);

	const slot = $derived(`pending-hint inline-flex size-3.5 shrink-0 items-center justify-center`);
</script>

<span class={['inline-flex items-center gap-2', className]}>
	{#if hint === 'start'}
		<span aria-hidden="true" class={slot} data-pending={pending ? '' : undefined}>
			{#if pending}<Spinner class="size-3.5" />{/if}
		</span>
	{/if}
	{@render children?.()}
	{#if hint === 'end'}
		<span aria-hidden="true" class={slot} data-pending={pending ? '' : undefined}>
			{#if pending}<Spinner class="size-3.5" />{/if}
		</span>
	{/if}
</span>

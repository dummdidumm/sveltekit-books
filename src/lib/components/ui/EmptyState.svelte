<script lang="ts">
	import type { Snippet } from 'svelte';
	import BookMark from './BookMark.svelte';

	type Props = {
		title: string;
		body?: string;
		children?: Snippet;
	};

	let { title, body, children }: Props = $props();
</script>

<div class="grid flex-1 place-items-center px-6 py-20 text-center">
	<div class="flex max-w-sm flex-col items-center gap-3">
		<BookMark animated class="mb-1 size-10" />
		<p class="text-sm font-medium">{title}</p>
		{#if body}
			<p class="text-sm leading-6 text-muted">{body}</p>
		{/if}
		{@render children?.()}
	</div>
</div>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

	type Props = {
		title?: string;
		body?: string;
		compact?: boolean;
		children?: Snippet;
	};

	let { title, body, compact = false, children }: Props = $props();
</script>

{#if compact}
	<div class="flex flex-col items-center gap-2 px-4 py-6 text-center">
		<AlertTriangle aria-hidden="true" class="size-4 text-danger" />
		<p class="text-xs text-muted">{title ?? 'Something went wrong'}</p>
		{#if body}
			<p class="text-xs leading-5 text-muted">{body}</p>
		{/if}
		{@render children?.()}
	</div>
{:else}
	<div class="grid flex-1 place-items-center px-6 py-20 text-center">
		<div class="flex max-w-sm flex-col items-center gap-3">
			<AlertTriangle aria-hidden="true" class="size-6 text-danger" />
			<p class="text-sm font-medium text-black dark:text-white">
				{title ?? 'Something went wrong'}
			</p>
			{#if body}
				<p class="text-sm leading-6 text-muted">{body}</p>
			{/if}
			{@render children?.()}
		</div>
	</div>
{/if}

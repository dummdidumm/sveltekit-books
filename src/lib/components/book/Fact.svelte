<script lang="ts">
	import type { Component } from 'svelte';
	import type { Snippet } from 'svelte';

	let { icon, label, children }: { icon: Component; label: string; children: Snippet } = $props();

	const Icon = $derived(icon);
</script>

<div class="flex items-start gap-3">
	<span class="mt-0.5 shrink-0 text-muted"><Icon aria-hidden="true" class="size-4" /></span>
	<div class="min-w-0">
		<dt class="text-xs font-semibold tracking-wide text-muted uppercase">{label}</dt>
		<dd class="mt-0.5 truncate text-sm">{@render children()}</dd>
	</div>
</div>

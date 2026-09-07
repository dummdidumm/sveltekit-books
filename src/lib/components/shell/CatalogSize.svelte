<script lang="ts">
	let { count }: { count: number } = $props();

	const display = $derived(count >= 1000 ? `${Math.floor(count / 1000)}K+` : String(count));
</script>

<div>
	<p class="text-2xl font-semibold tracking-tight tabular-nums">{display}</p>
	<p class="mt-1 text-xs leading-5 text-muted">books from Goodreads. Built on SvelteKit.</p>
</div>

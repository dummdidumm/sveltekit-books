<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	let { class: className, style }: { class?: ClassValue; style?: string } = $props();
</script>

<span aria-hidden="true" class={['skeleton-animation block', className]} {style}></span>

<script lang="ts">
	import Skeleton from '#lib/components/ui/Skeleton.svelte';

	let { class: className }: { class?: string } = $props();
</script>

<Skeleton class={['skeleton-subtle aspect-[2/3] w-full rounded-md', className]} />

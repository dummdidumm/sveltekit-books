<script lang="ts">
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	let { class: className }: { class?: string } = $props();
</script>

<LoaderCircle aria-hidden="true" class={['size-4 shrink-0 animate-spin', className]} />

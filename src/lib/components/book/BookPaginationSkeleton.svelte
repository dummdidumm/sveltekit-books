<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Skeleton from '#lib/components/ui/Skeleton.svelte';

	const stepClass =
		'text-muted hover:bg-card dark:hover:bg-card-dark focus-visible:ring-action/40 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white';
</script>

<div aria-hidden="true" class="flex items-center justify-between gap-4">
	<span class={[stepClass, 'pointer-events-none opacity-40']}>
		<ChevronLeft aria-hidden="true" class="size-4" />
		Previous
	</span>
	<div class="flex items-center gap-2">
		<Skeleton class="skeleton-subtle hidden h-4 w-20 sm:block" />
		<span class="hidden h-3 w-px bg-divider sm:block dark:bg-divider-dark"></span>
		<Skeleton class="skeleton-subtle h-4 w-20" />
	</div>
	<span class={[stepClass, 'pointer-events-none opacity-40']}>
		Next
		<ChevronRight aria-hidden="true" class="size-4" />
	</span>
</div>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	type Props = HTMLSelectAttributes & {
		children?: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<span class="relative block min-w-0">
	<select
		{...rest}
		class={[
			'w-full appearance-none rounded-md border border-divider bg-white px-3 py-2 pr-8 text-sm text-black transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25 focus:outline-none disabled:cursor-not-allowed disabled:bg-card disabled:text-muted disabled:opacity-60 dark:border-divider-dark dark:bg-[#1c1c1c] dark:text-white dark:disabled:bg-card-dark',
			className
		]}
	>
		{@render children?.()}
	</select>
	<ChevronDown
		aria-hidden="true"
		class="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted"
	/>
</span>

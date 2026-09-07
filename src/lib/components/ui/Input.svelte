<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Variant = 'checkbox' | 'default' | 'search' | 'unstyled';

	type Props = Omit<HTMLInputAttributes, 'variant'> & {
		variant?: Variant;
		ref?: HTMLInputElement | null;
	};

	const base =
		'border-divider placeholder-gray focus:border-accent focus:ring-accent/25 dark:border-divider-dark disabled:bg-card disabled:text-muted dark:disabled:bg-card-dark w-full rounded-md border bg-white px-3 py-2 text-sm text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#1c1c1c] dark:text-white';

	const variants: Record<Variant, string> = {
		checkbox:
			'accent-action size-4 w-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
		default: base,
		search: `${base} h-11 rounded-lg pr-10 pl-10 text-base sm:text-sm`,
		unstyled: ''
	};

	let {
		class: className,
		type,
		variant = 'default',
		ref = $bindable(null),
		...rest
	}: Props = $props();
</script>

<input
	bind:this={ref}
	{type}
	{...rest}
	class={[variants[type === 'hidden' ? 'unstyled' : variant], className]}
/>

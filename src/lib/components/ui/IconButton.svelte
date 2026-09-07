<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Size = 'default' | 'sm';

	type Props = HTMLButtonAttributes & {
		label: string;
		size?: Size;
		children?: Snippet;
	};

	const base =
		'text-muted hover:bg-card focus-visible:ring-accent/40 dark:hover:bg-card-dark inline-flex shrink-0 items-center justify-center rounded-md transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-white';

	const sizes: Record<Size, string> = {
		default: 'size-8',
		sm: 'size-7'
	};

	let {
		class: className,
		label,
		size = 'default',
		type = 'button',
		children,
		...rest
	}: Props = $props();
</script>

<button aria-label={label} {type} {...rest} class={[base, sizes[size], className]}>
	{@render children?.()}
</button>

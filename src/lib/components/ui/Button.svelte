<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { buttonClasses, type ButtonSize, type ButtonVariant } from './button-classes';

	type Props = HTMLButtonAttributes & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		href?: string;
		children?: Snippet;
	};

	let {
		class: className,
		variant = 'primary',
		size = 'default',
		href,
		type = 'button',
		disabled,
		children,
		...rest
	}: Props = $props();
</script>

{#if href}
	<a {href} class={buttonClasses({ className, size, variant })}>{@render children?.()}</a>
{:else}
	<button {type} {disabled} {...rest} class={buttonClasses({ className, size, variant })}>
		{@render children?.()}
	</button>
{/if}

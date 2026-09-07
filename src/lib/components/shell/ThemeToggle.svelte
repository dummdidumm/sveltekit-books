<script lang="ts">
	import Monitor from '@lucide/svelte/icons/monitor';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { theme, type Theme } from '#lib/theme.svelte.ts';

	type Props = {
		variant?: 'inline' | 'pill';
	};

	let { variant = 'pill' }: Props = $props();

	const active = $derived(theme.mounted ? theme.value : undefined);

	function toggle(buttons: { label: string; value: Theme }) {
		theme.set(buttons.value);
	}

	const options: { label: string; value: Theme }[] = [
		{ label: 'Light mode', value: 'light' },
		{ label: 'Dark mode', value: 'dark' },
		{ label: 'System theme', value: 'system' }
	];
</script>

<div
	class={variant === 'inline'
		? 'inline-flex items-center gap-0.5'
		: 'inline-flex items-center rounded-full border border-divider p-0.5 dark:border-divider-dark'}
>
	{#each options as option (option.value)}
		<button
			aria-label={option.label}
			aria-pressed={active === option.value}
			class={[
				'rounded-full p-1.5 transition-colors',
				active === option.value
					? 'bg-card text-black dark:bg-card-dark dark:text-white'
					: 'text-muted hover:text-black dark:hover:text-white'
			]}
			type="button"
			onclick={() => toggle(option)}
		>
			{#if option.value === 'light'}
				<Sun class="size-4" />
			{:else if option.value === 'dark'}
				<Moon class="size-4" />
			{:else}
				<Monitor class="size-4" />
			{/if}
		</button>
	{/each}
</div>

<script lang="ts">
	import Star from '@lucide/svelte/icons/star';

	let { class: className, rating }: { class?: string; rating: number } = $props();

	const rounded = $derived(Math.round(rating * 2) / 2);
	const stars = $derived(
		Array.from({ length: 5 }, (_, index) => {
			const filled = index + 1 <= rounded;
			const half = !filled && index + 0.5 === rounded;
			return { filled, half };
		})
	);
</script>

<span
	aria-label={`Rated ${rating.toFixed(1)} out of 5`}
	class={['inline-flex items-center gap-0.5', className]}
	role="img"
>
	{#each stars as star, index (index)}
		<Star
			aria-hidden="true"
			class={[
				'size-4',
				star.filled || star.half
					? 'fill-current text-warning'
					: 'fill-current text-divider dark:text-divider-dark'
			]}
			strokeWidth={0}
		/>
	{/each}
</span>

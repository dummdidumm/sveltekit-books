<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		onValueChange: (value: number) => void;
		label: string;
		id?: string;
		value: number;
		values: readonly number[];
		readout?: string;
		hint?: Snippet;
		// Optional live readout formatter: receives the value the thumb is currently
		// over while dragging, before it is committed via `onValueChange`.
		formatReadout?: (value: number) => string;
		class?: string;
	};

	let {
		label,
		id,
		value,
		values,
		readout,
		hint,
		onValueChange,
		formatReadout,
		class: className
	}: Props = $props();

	const selectedIndex = $derived(
		values.reduce(
			(closest, option, index) =>
				Math.abs(option - value) < Math.abs(values[closest] - value) ? index : closest,
			0
		)
	);

	// Writable derived: `oninput` assigns a local override so the readout tracks the
	// thumb while dragging; it resets to `selectedIndex` whenever `value` changes.
	let liveIndex = $derived(selectedIndex);

	const readoutText = $derived(
		formatReadout ? formatReadout(values[liveIndex]) : (readout ?? String(value))
	);

	function handleInput(event: Event) {
		liveIndex = Number((event.currentTarget as HTMLInputElement).value);
	}

	function handleChange(event: Event) {
		const index = Number((event.currentTarget as HTMLInputElement).value);
		liveIndex = index;
		onValueChange(values[index]);
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-baseline justify-between gap-2">
		<label class="text-xs font-semibold tracking-wide text-muted uppercase" for={id}>
			{label}
		</label>
		<span class="text-sm font-medium text-black tabular-nums dark:text-white">{readoutText}</span>
	</div>
	<input
		oninput={handleInput}
		onchange={handleChange}
		class={[
			'cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none',
			className
		]}
		{id}
		max={values.length - 1}
		min={0}
		step={1}
		type="range"
		value={liveIndex}
	/>
	{#if hint}
		<div class="flex justify-between text-[11px] text-muted tabular-nums">{@render hint()}</div>
	{/if}
</div>

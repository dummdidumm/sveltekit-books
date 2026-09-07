<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import SearchIcon from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import IconButton from '#lib/components/ui/IconButton.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Spinner from '#lib/components/ui/Spinner.svelte';
	import { buildHref, parseSearchParams, withFilters } from '#lib/books/url-state.ts';

	const DEBOUNCE_MS = 220;

	const inputId = $props.id();

	// Uncontrolled input: captured once at first render so SSR seeds the value.
	const initial = page.url.searchParams.get('search') ?? '';

	let ref = $state<HTMLInputElement | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const isPending = $derived(!!navigating.to && navigating.to.url.pathname === '/');

	function navigate(value: string) {
		const query = value.trim();
		const next = withFilters(parseSearchParams(page.url.searchParams), {
			search: query || undefined
		});
		goto(buildHref(next), { replace: true, reset: false });
	}

	function handleInput(event: Event) {
		const { value } = event.currentTarget as HTMLInputElement;
		clearTimeout(timer);
		timer = setTimeout(() => navigate(value), DEBOUNCE_MS);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		clearTimeout(timer);
		navigate(ref?.value ?? '');
	}

	function clear() {
		clearTimeout(timer);
		if (ref) ref.value = '';
		navigate('');
		ref?.focus();
	}

	// Keep the input in sync with the URL without clobbering it while typing.
	$effect(() => {
		const value = page.url.searchParams.get('search') ?? '';
		if (ref && ref.value !== value && document.activeElement !== ref) {
			ref.value = value;
		}
	});
</script>

<form
	role="search"
	aria-busy={isPending}
	data-filtering={isPending ? '' : undefined}
	class="relative flex-1"
	onsubmit={handleSubmit}
>
	<label class="sr-only" for={inputId}>Search books</label>
	<span
		aria-hidden="true"
		class="pointer-events-none absolute top-1/2 left-3.5 flex size-4 -translate-y-1/2 items-center justify-center text-muted"
	>
		{#if isPending}
			<Spinner class="size-4" />
		{:else}
			<SearchIcon class="size-4" />
		{/if}
	</span>
	<Input
		bind:ref
		class="peer"
		id={inputId}
		name="search"
		placeholder="Search books…"
		type="search"
		variant="search"
		value={initial}
		oninput={handleInput}
	/>
	<IconButton
		class="absolute top-1/2 right-1.5 -translate-y-1/2 peer-placeholder-shown:hidden"
		label="Clear search"
		onclick={clear}
	>
		<X class="size-4" />
	</IconButton>
</form>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import X from '@lucide/svelte/icons/x';

	type Props = {
		open?: boolean;
		children?: Snippet;
	};

	let { open = $bindable(false), children }: Props = $props();

	let dialog: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (!dialog) return;
		if (open) {
			if (!dialog.open) dialog.showModal();
		} else if (dialog.open) {
			dialog.close();
		}
	});

	function handleClick(event: MouseEvent) {
		if (!dialog) return;
		const target = event.target as HTMLElement;
		// Clicks on the backdrop hit the <dialog> element itself.
		if (event.target === dialog) {
			open = false;
			return;
		}
		if (target.closest('a[href]')) open = false;
	}
</script>

<dialog
	bind:this={dialog}
	class="fixed inset-y-0 left-0 z-50 m-0 h-dvh max-h-none w-[min(20rem,calc(100vw-3rem))] max-w-full touch-pan-y flex-col overflow-x-hidden border-r border-divider bg-surface pt-[max(1rem,env(safe-area-inset-top))] pr-4 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] shadow-2xl outline-none open:flex md:hidden dark:border-divider-dark dark:bg-surface-dark"
	onclick={handleClick}
	onclose={() => (open = false)}
>
	<h2 class="sr-only">Book filters</h2>
	<button
		aria-label="Close filters"
		class="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 grid size-9 place-items-center rounded-md text-muted hover:bg-card hover:text-black focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none dark:hover:bg-card-dark dark:hover:text-white"
		type="button"
		onclick={() => (open = false)}
	>
		<X class="size-5" />
	</button>
	{@render children?.()}
</dialog>

<style>
	dialog::backdrop {
		background: rgb(0 0 0 / 0.45);
		backdrop-filter: blur(2px);
	}
</style>

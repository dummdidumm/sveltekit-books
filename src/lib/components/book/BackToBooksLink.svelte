<script lang="ts">
	import { goto } from '$app/navigation';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	const linkClass =
		'text-muted hover:bg-card dark:hover:bg-card-dark -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-black dark:hover:text-white';

	let { class: className }: { class?: string } = $props();

	// `window.navigation` is an unstandardized API; only trust it when present.
	type WindowWithNavigation = Window & { navigation?: { canGoBack?: boolean } };

	function backToBooks() {
		if ('navigation' in window && (window as WindowWithNavigation).navigation?.canGoBack) {
			history.back();
		} else {
			void goto('/');
		}
	}
</script>

<button type="button" class={[linkClass, className]} onclick={backToBooks}>
	<ArrowLeft aria-hidden="true" class="size-4" />
	Back to books
</button>

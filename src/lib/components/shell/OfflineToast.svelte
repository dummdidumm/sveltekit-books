<script lang="ts">
	import { browser } from '$app/env';
	import WifiOff from '@lucide/svelte/icons/wifi-off';

	// SSR has no navigator: start optimistic and let the client binding correct it.
	let online = $state(true);
</script>

<svelte:window bind:online />

{#if browser && !online}
	<div
		role="status"
		class="fixed right-4 bottom-4 z-[9999] flex items-center gap-2 rounded-lg border border-divider bg-white px-4 py-3 text-sm shadow-soft dark:border-divider-dark dark:bg-card-dark"
	>
		<WifiOff aria-hidden="true" class="size-4 text-danger" />
		You're offline — reconnecting…
	</div>
{/if}

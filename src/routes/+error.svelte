<script lang="ts">
	import { page } from '$app/state';
	import Button from '#lib/components/ui/Button.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import ErrorState from '#lib/components/ui/ErrorState.svelte';
</script>

{#if page.status === 404}
	<EmptyState title="Page not found" body="That page isn't in the catalog.">
		<Button class="mt-1" href="/" variant="secondary">Back to the shelf</Button>
	</EmptyState>
{:else}
	<ErrorState title="Something went wrong" body="We couldn't load this page. Please try again.">
		<Button class="mt-1" size="sm" variant="secondary" onclick={() => location.reload()}>
			Try again
		</Button>
	</ErrorState>
{/if}

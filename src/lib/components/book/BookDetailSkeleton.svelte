<script lang="ts">
	import Skeleton from '#lib/components/ui/Skeleton.svelte';
	import BookCoverSkeleton from './BookCoverSkeleton.svelte';
</script>

<div aria-hidden="true" class="flex flex-col gap-8 md:flex-row md:gap-10">
	<div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
		<BookCoverSkeleton />
	</div>
	<div class="min-w-0 flex-1">
		<Skeleton class="skeleton-subtle h-8 w-3/4 max-w-md" />
		<Skeleton class="skeleton-subtle mt-3 h-5 w-40" />
		<Skeleton class="skeleton-subtle mt-5 h-4 w-56" />
		<div class="mt-6 flex flex-col gap-2.5">
			<Skeleton class="skeleton-subtle h-3.5 w-full max-w-prose" />
			<Skeleton class="skeleton-subtle h-3.5 w-full max-w-prose" />
			<Skeleton class="skeleton-subtle h-3.5 w-4/5 max-w-prose" />
		</div>
		<div
			class="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-divider pt-6 sm:grid-cols-2 dark:border-divider-dark"
		>
			{#each Array.from({ length: 5 }) as _, index (index)}
				<div class="flex items-start gap-3">
					<Skeleton class="skeleton-subtle mt-0.5 size-4 rounded" />
					<div class="flex min-w-0 flex-1 flex-col gap-1.5">
						<Skeleton class="skeleton-subtle h-3 w-16" />
						<Skeleton class="skeleton-subtle h-4 w-24" />
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

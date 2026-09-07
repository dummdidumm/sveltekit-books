<script lang="ts">
	import { coverSrc, coverSrcset } from '#lib/books/images.ts';
	import { EMPTY_IMAGE_URL, getLargeBookImageUrl } from '#lib/books/constants.ts';
	import { thumbhashToDataUrl } from '#lib/books/thumbhash.ts';

	let {
		title,
		src,
		thumbhash,
		sizes,
		priority = false,
		class: className
	}: {
		title: string;
		src: string | null;
		thumbhash: string | null;
		sizes: string;
		priority?: boolean;
		class?: string;
	} = $props();

	const url = $derived(getLargeBookImageUrl(src ?? EMPTY_IMAGE_URL));
	const srcset = $derived(coverSrcset(url));
	const placeholder = $derived(
		thumbhash
			? `background-image:url(${thumbhashToDataUrl(thumbhash)});background-size:cover;background-position:center`
			: undefined
	);
</script>

<div
	class={[
		'relative aspect-[2/3] w-full overflow-hidden rounded-md bg-card dark:bg-card-dark',
		className
	]}
	style={placeholder}
>
	<img
		alt={title}
		class="absolute inset-0 size-full object-cover text-transparent"
		src={coverSrc(url, 384)}
		{srcset}
		{sizes}
		loading={priority ? 'eager' : 'lazy'}
		fetchpriority={priority ? 'high' : 'auto'}
		decoding="async"
	/>
</div>

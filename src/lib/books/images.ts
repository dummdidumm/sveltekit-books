import { dev } from '$app/env';

export const COVER_WIDTHS = [128, 192, 256, 384, 512, 768];

export function coverSrc(url: string, width: number): string {
	if (dev) return url;
	return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=75`;
}

export function coverSrcset(
	url: string,
	widths: readonly number[] = COVER_WIDTHS
): string | undefined {
	if (dev) return undefined;
	return widths.map((w) => `${coverSrc(url, w)} ${w}w`).join(', ');
}

export const COVER_WIDTHS = [128, 192, 256, 384, 512, 768];

export function coverSrc(url: string, width: number): string {
	if (!process.env.VERCEL) return url;
	return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=75`;
}

export function coverSrcset(
	url: string,
	widths: readonly number[] = COVER_WIDTHS
): string | undefined {
	if (!process.env.VERCEL) return undefined;
	return widths.map((w) => `${coverSrc(url, w)} ${w}w`).join(', ');
}

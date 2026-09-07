import { thumbHashToDataURL } from 'thumbhash';

export function thumbhashToDataUrl(base64: string): string {
	try {
		const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
		return thumbHashToDataURL(binary);
	} catch {
		return '';
	}
}

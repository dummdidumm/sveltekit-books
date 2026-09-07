import { goto } from '$app/navigation';
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

const INTERACTIVE_SELECTOR =
	'button, input, select, textarea, [contenteditable="true"], [role="button"]';

function isSameOrigin(href: string): boolean {
	try {
		return new URL(href, window.location.href).origin === window.location.origin;
	} catch {
		return false;
	}
}

/**
 * Start navigation on `mousedown` instead of `click`, shaving a round trip of
 * pointer latency off every link.
 */
export function fastLink(): Attachment<HTMLAnchorElement> {
	let resetTimer: ReturnType<typeof setTimeout> | undefined;
	let navigatedOnMouseDown = false;

	function handleMouseDown(event: MouseEvent) {
		if (!(event.currentTarget instanceof HTMLAnchorElement)) return;
		const anchor = event.currentTarget;

		const target = anchor.getAttribute('target');
		const interactiveTarget =
			event.target instanceof Element ? event.target.closest(INTERACTIVE_SELECTOR) : null;
		const shouldNavigate =
			!interactiveTarget &&
			(!target || target === '_self') &&
			!event.metaKey &&
			!event.ctrlKey &&
			!event.shiftKey &&
			!event.altKey &&
			!anchor.hasAttribute('download') &&
			event.button === 0 &&
			isSameOrigin(anchor.href);

		if (!shouldNavigate) return;

		event.preventDefault();
		navigatedOnMouseDown = true;
		goto(anchor.href).catch(() => {});
		clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			navigatedOnMouseDown = false;
		}, 500);
	}

	function handleClick(event: MouseEvent) {
		if (!navigatedOnMouseDown) return;
		clearTimeout(resetTimer);
		navigatedOnMouseDown = false;
		event.preventDefault();
	}

	return (anchor) => {
		const mousedownOff = on(anchor, 'mousedown', handleMouseDown);
		const clickOff = on(anchor, 'click', handleClick);
		return () => {
			mousedownOff();
			clickOff();
			clearTimeout(resetTimer);
		};
	};
}

import type { ClassValue } from 'svelte/elements';

export type ButtonVariant = 'ghost' | 'primary' | 'secondary';
export type ButtonSize = 'default' | 'icon' | 'sm';

export const buttonBase =
	'focus-visible:ring-action/40 inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

export const buttonSizes: Record<ButtonSize, string> = {
	default: 'h-9 px-4 text-sm',
	icon: 'size-9',
	sm: 'h-8 px-3 text-xs'
};

export const buttonVariants: Record<ButtonVariant, string> = {
	ghost: 'text-muted hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white',
	primary: 'bg-action text-white hover:bg-action-hover',
	secondary:
		'border-divider hover:border-gray/40 hover:bg-card dark:border-divider-dark dark:hover:border-gray/30 dark:hover:bg-card-dark border bg-white text-black dark:bg-transparent dark:text-white'
};

export function buttonClasses({
	className,
	size = 'default',
	variant = 'primary'
}: {
	className?: ClassValue | null;
	size?: ButtonSize;
	variant?: ButtonVariant;
} = {}) {
	return [buttonBase, buttonSizes[size], buttonVariants[variant], className];
}

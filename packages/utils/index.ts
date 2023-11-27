import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'pl'] as const;

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
	locales,
});

import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

/** Merge class names: clsx conditionals + tailwind-merge conflict resolution. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

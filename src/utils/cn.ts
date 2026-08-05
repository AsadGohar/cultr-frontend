import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * this function combines and merges class names using clsx and tailwind-merge
 *
 * @param inputs - Array of class names, objects, or arrays to be combined
 * @returns Merged and deduped class string
 *
 * @example
 * cn('p-4', 'bg-blue-500', conditional && 'text-white')
 * cn('p-2 bg-red-500', { 'text-white': isLight, 'text-black': !isLight })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

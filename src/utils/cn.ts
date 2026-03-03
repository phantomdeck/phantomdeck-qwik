import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility for cleanly merging Tailwind classes. 
 * Essential for reusable components that need to accept 
 * extra classes from the outside (like shadcn).
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

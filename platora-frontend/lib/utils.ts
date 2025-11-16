import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Get a human-friendly message from an unknown error
export function getErrorMessage(err: unknown): string {
    if (!err) return "An unexpected error occurred";
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    try {
        return String(err);
    } catch {
        return "An unexpected error occurred";
    }
}

export function formatPrice(p: string | number | null | undefined) {
    if (p === null || p === undefined) return '—';
    const n = typeof p === 'string' ? parseFloat(p) : Number(p);
    if (Number.isNaN(n)) return '—';
    return n % 1 === 0 ? `₹${n}` : `₹${n.toFixed(2)}`;
}
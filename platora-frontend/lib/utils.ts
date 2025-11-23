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

// small pick helper (similar to others) to read unknown shapes
export function asRecord(v: unknown): Record<string, unknown> {
    return (typeof v === 'object' && v !== null) ? (v as Record<string, unknown>) : {}
}

export function pick<T = unknown>(v: unknown, keys: string[], fallback?: T): T | undefined {
    const r = asRecord(v)
    for (const k of keys) {
        if (k in r) {
            const val = r[k]
            if (val !== undefined && val !== null) return val as unknown as T
        }
    }
    return fallback
}

export function formatDate(v?: string | null) {
    if (!v) return '—'
    try {
        return new Date(String(v)).toLocaleString()
    } catch {
        return String(v)
    }
}

import type {MenuItem, Restaurant, User} from './types';

// Export API_URL so client pages can reuse the same backend base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// --- Server-side helpers (used from server components) ---
export async function fetchRestaurants(): Promise<Restaurant[]> {
    const res = await fetch(`${API_URL}/api/restaurants`, {cache: 'no-store'});
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch restaurants: ${res.status} ${text}`);
    }
    const data = await res.json();
    return (data.restaurants || []) as Restaurant[];
}

export async function fetchRestaurantById(id: string | number): Promise<Restaurant | null> {
    const res = await fetch(`${API_URL}/api/restaurants/${id}`, {cache: 'no-store'});
    if (res.status === 404) return null;
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch restaurant ${id}: ${res.status} ${text}`);
    }
    const data = await res.json();
    return (data.restaurant || null) as Restaurant | null;
}

export async function fetchMenuByRestaurant(restaurantId: string | number): Promise<MenuItem[]> {
    const res = await fetch(`${API_URL}/api/menu/restaurant/${restaurantId}`, {cache: 'no-store'});
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch menu: ${res.status} ${text}`);
    }
    const data = await res.json();
    // backend currently returns items in different keys; normalize
    return (data.items || data.menu || []) as MenuItem[];
}

// --- Client-side auth helpers ---
// These functions are safe to import in client components; they check for `window` before using localStorage.

function isClient() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getToken(): string | null {
    if (!isClient()) return null;
    try {
        return localStorage.getItem('token');
    } catch {
        return null;
    }
}

export function setToken(token: string) {
    if (!isClient()) return;
    try {
        localStorage.setItem('token', token);
    } catch {
    }
}

export function clearAuthStorage() {
    if (!isClient()) return;
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // notify other tabs
        try { window.dispatchEvent(new Event('authChange')); } catch {}
    } catch {}
}

// Small wrapper for client fetches that automatically attaches Authorization header when token exists
export async function authFetch(input: string, init?: RequestInit) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(init && (init.headers as Record<string,string> || {})) };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(input, {...init, headers});
}

// login/signup helpers
export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as Record<string, unknown>)?.['error'] as string || `Login failed (${res.status})`);
    return data as {token?: string, user?: User, [k:string]: unknown};
}

export async function signup(payload: {email:string,password:string,name?:string,phone?:string,role?:string}) {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as Record<string, unknown>)?.['error'] as string || `Signup failed (${res.status})`);
    return data as {token?: string, user?: User, [k:string]: unknown};
}

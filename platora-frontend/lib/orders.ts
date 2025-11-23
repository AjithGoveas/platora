import {API_URL, authFetch} from './api';
import mockAgents from './mockDeliveryAgents';
import type {Address, ClientOrder, ClientOrderItem, DeliveryAgent} from './types';

const ORDERS_KEY = 'platora_orders_v1';

function isClient() {
    return typeof window !== 'undefined' && !!window.localStorage;
}

// small runtime type guard
function isArrayOfObjects(v: unknown): v is Array<Record<string, unknown>> {
    return Array.isArray(v) && v.every((it) => typeof it === 'object' && it !== null);
}

async function readRaw(): Promise<ClientOrder[]> {
    if (!isClient()) return [];
    try {
        const raw = localStorage.getItem(ORDERS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as ClientOrder[]) : [];
    } catch (e) {
        console.warn('lib/orders: failed to read orders from localStorage, recovering', e);
        try {
            localStorage.removeItem(ORDERS_KEY);
        } catch {
        }
        return [];
    }
}

async function writeRaw(next: ClientOrder[]) {
    if (!isClient()) return;
    try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
        try {
            window.dispatchEvent(new Event('ordersChange'))
        } catch {
        }
    } catch (e) {
        console.error('lib/orders: failed to write orders to localStorage', e);
        throw e;
    }
}

export async function getOrders(): Promise<ClientOrder[]> {
    const arr = await readRaw();
    return arr.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export async function getOrderById(id: string): Promise<ClientOrder | undefined> {
    const arr = await readRaw();
    return arr.find((o) => String(o.id) === String(id));
}

export async function saveOrder(order: ClientOrder): Promise<void> {
    const arr = await readRaw();
    const next = [order, ...arr];
    await writeRaw(next);
}

export async function clearOrders(): Promise<void> {
    if (!isClient()) return;
    try {
        localStorage.removeItem(ORDERS_KEY);
        try {
            window.dispatchEvent(new Event('ordersChange'))
        } catch {
        }
    } catch (e) {
        console.error('lib/orders: failed to clear orders', e);
    }
}

export function selfTest() {
    if (!isClient()) return;
    try {
        const id = `test_${Date.now()}`;
        const testOrder: ClientOrder = {
            id,
            items: [{menu_item_id: 't1', name: 'Test', unit_price: 5, quantity: 1}],
            subtotal: 5,
            tax: 0.5,
            total: 5.5,
            createdAt: new Date().toISOString(),
        };

        readRaw().then((before) => {
            writeRaw([testOrder, ...before]).then(() => {
                readRaw().then((after) => {
                    const found = after.find((o) => o.id === id);
                    console.assert(!!found, 'orders.selfTest: saved order not found');
                    // restore previous state
                    const restored = after.filter((o) => String(o.id) !== String(id));
                    writeRaw(restored).catch((e) => console.error('orders.selfTest: failed to restore', e));
                });
            });
        });
    } catch (e) {
        console.error('orders.selfTest failed', e);
    }
}

async function pickRandomAgent(): Promise<DeliveryAgent> {
    // Try to fetch delivery agents from backend (requires auth). Backend does not
    // currently provide a dedicated public "delivery agents" endpoint in all
    // setups, so we attempt a couple of reasonable endpoints and fall back to the
    // bundled mocks on any failure.
    try {
        // Prefer an authenticated users listing filtered by role if available
        const tryUrls = [
            `${API_URL}/api/users?role=delivery`,
            `${API_URL}/api/delivery-agents`,
            `${API_URL}/api/agents/delivery`,
        ];
        for (const url of tryUrls) {
            try {
                const res = await authFetch(url);
                if (!res || !res.ok) continue;
                const data = await res.json().catch(() => ({} as unknown));
                // backend may return { users: [...] } or an array directly
                let list: Array<Record<string, unknown>> = [];
                if (isArrayOfObjects(data)) list = data;
                else if (isArrayOfObjects((data as Record<string, unknown>)?.users)) list = (data as Record<string, unknown>).users as Array<Record<string, unknown>>;
                else if (isArrayOfObjects((data as Record<string, unknown>)?.agents)) list = (data as Record<string, unknown>).agents as Array<Record<string, unknown>>;

                if (list.length > 0) {
                    const idx = Math.floor(Math.random() * list.length);
                    const a = list[idx];
                    const phone = typeof a.phone === 'string' ? a.phone : undefined;
                    const vehicle = typeof a.vehicle === 'string' ? a.vehicle : undefined;
                    return {
                        id: (a.id as string | number),
                        name: (typeof a.name === 'string' ? a.name : String(a.id)),
                        // normalize null -> undefined so callers expecting string|undefined don't get null
                        phone,
                        vehicle,
                    } as DeliveryAgent;
                }
            } catch {
                // continue to next URL
            }
        }
    } catch {
        // ignore and fallback
    }

    // Fallback to bundled mock agents
    const idx = Math.floor(Math.random() * mockAgents.length);
    const a = mockAgents[idx];
    return {
        id: a.id,
        name: a.name,
        phone: a.phone ?? undefined,
        vehicle: a.vehicle ?? undefined,
    } as DeliveryAgent;
}

export async function createOrder(payload: {
    items: ClientOrderItem[];
    subtotal: number;
    tax?: number;
    total: number;
    address?: Address;
    restaurantId?: string | number | null;
}): Promise<ClientOrder> {
    // Try to create on backend if token present
    try {
        const body = {
            items: payload.items,
            subtotal: payload.subtotal,
            tax: payload.tax ?? 0,
            total: payload.total,
            address: payload.address ?? null,
            restaurant_id: payload.restaurantId ?? null,
        };
        const res = await authFetch(`${API_URL}/api/orders`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (res.ok) {
            const data = await res.json().catch(() => ({} as Record<string, unknown>));
            const rec = data as Record<string, unknown>;
            // Normalize to ClientOrder where possible
            const id = String(rec['id'] ?? (rec['order'] && (rec['order'] as Record<string, unknown>)['id']) ?? (Date.now()));
            const items = Array.isArray(rec['items']) ? (rec['items'] as unknown as ClientOrderItem[]) : payload.items;

            const rawAssignedRaw = rec['assignedAgent'] ?? rec['deliveryAgent'];
            let assignedAgent: DeliveryAgent | undefined;
            if (rawAssignedRaw && typeof rawAssignedRaw === 'object') {
                const ra = rawAssignedRaw as Record<string, unknown>;
                assignedAgent = {
                    id: (ra.id as string | number),
                    name: (typeof ra.name === 'string' ? ra.name : String(ra.id)),
                    phone: (typeof ra.phone === 'string' ? ra.phone : undefined),
                    vehicle: (typeof ra.vehicle === 'string' ? ra.vehicle : undefined),
                };
            }

            const order: ClientOrder = {
                id,
                items,
                subtotal: Number(rec['subtotal'] ?? payload.subtotal),
                tax: Number(rec['tax'] ?? payload.tax ?? 0),
                total: Number(rec['total'] ?? payload.total),
                createdAt: String(rec['createdAt'] ?? rec['created_at'] ?? new Date().toISOString()),
                status: String(rec['status'] ?? 'Pending'),
                address: payload.address,
                assignedAgent: assignedAgent ? {
                    id: assignedAgent.id,
                    name: assignedAgent.name,
                    phone: assignedAgent.phone ?? undefined
                } : undefined,
                metadata: {
                    restaurantId: payload.restaurantId ?? null,
                },
            };
            // Save locally for client access as well
            await saveOrder(order);
            return order;
        }
    } catch (e) {
        console.warn('createOrder: backend request failed, falling back to local save', e);
    }

    // Fallback: create a client order and assign a random agent
    const id = `local_${Date.now()}`;
    const agent = await pickRandomAgent();
    const clientOrder: ClientOrder = {
        id,
        items: payload.items,
        subtotal: payload.subtotal,
        tax: payload.tax ?? 0,
        total: payload.total,
        createdAt: new Date().toISOString(),
        status: 'Pending',
        address: payload.address,
        assignedAgent: {id: agent.id, name: agent.name, phone: agent.phone ?? undefined},
        metadata: {
            restaurantId: payload.restaurantId ?? null,
        },
    };
    await saveOrder(clientOrder);
    return clientOrder;
}

export async function markOrderDelivered(orderId: string): Promise<ClientOrder | undefined> {
    // Try backend first
    try {
        const res = await authFetch(`${API_URL}/api/orders/${orderId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({status: 'Delivered'}),
        });
        if (res && res.ok) {
            // Update local copy if present
            const arr = await readRaw();
            const idx = arr.findIndex((o) => String(o.id) === String(orderId));
            if (idx >= 0) {
                const updated: ClientOrder = {
                    ...arr[idx],
                    status: 'Delivered',
                    createdAt: arr[idx].createdAt,
                };
                arr[idx] = updated;
                await writeRaw(arr);
                return updated;
            }
            return undefined;
        }
    } catch (e) {
        console.warn('markOrderDelivered: backend failed, falling back to local update', e);
    }

    // Fallback: local update
    const arr = await readRaw();
    const idx = arr.findIndex((o) => String(o.id) === String(orderId));
    if (idx >= 0) {
        arr[idx].status = 'Delivered';
        await writeRaw(arr);
        return arr[idx];
    }
    return undefined;
}

// Attach helpers to window in client builds in a way that avoids `any` casts
if (typeof window !== 'undefined') {
    const helpers = {
        clearOrders,
        selfTest,
        markOrderDelivered,
    } as const;

    Object.defineProperty(window, '__platora_helpers', {
        value: helpers,
        writable: true,
        configurable: true,
    });

    // read them via a typed assertion to mark as used for linters (no `any` used)
    void (window as unknown as { __platora_helpers?: typeof helpers }).__platora_helpers?.clearOrders;
    void (window as unknown as { __platora_helpers?: typeof helpers }).__platora_helpers?.selfTest;
    void (window as unknown as { __platora_helpers?: typeof helpers }).__platora_helpers?.markOrderDelivered;
}

'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_URL, authFetch } from '@/lib/api';

// Raw delivery row shape returned by backend function (best-effort)
type RawDeliveryRow = {
    delivery_id?: number;
    id?: number;
    order_id?: number;
    orderId?: number;
    address?: string;
    delivery_address?: string;
    shipping_address?: string;
    customer_name?: string;
    customer?: string;
    name?: string;
    customer_contact?: string;
    phone?: string;
    contact?: string;
    items?: unknown[];
    order_items?: unknown[];
    menu_items?: unknown[];
    status?: string;
    order_status?: string;
    assigned_at?: string;
    created_at?: string;
    updated_at?: string;
};

type Order = {
    deliveryId: number | string; // delivery row id (used for status updates)
    orderId: number | string; // original order id (display only)
    address?: string;
    customerName?: string;
    customerContact?: string;
    items?: Array<string | { name?: string }>; // items might be strings or objects depending on API
    status?: 'pending' | 'assigned' | 'delivered' | string;
    createdAt?: string;
};

export default function DeliveryDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<Record<string | number, boolean>>({});

    useEffect(() => {
        let mounted = true;

        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                // Use backend API_URL so the request goes to the Express API (not Next's /api)
                const res = await authFetch(`${API_URL}/api/deliveries/my`, { method: 'GET', cache: 'no-store' });
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    throw new Error(`Server returned ${res.status} ${text}`);
                }
                const ordersData = await res.json();
                // Normalize possible response shapes:
                // - array of orders/deliveries
                // - { data: [...] }
                // - { deliveries: [...] } (backend current shape)
                // - { orders: [...] }
                let arr: RawDeliveryRow[];
                if (Array.isArray(ordersData)) {
                    arr = ordersData as RawDeliveryRow[];
                } else if (Array.isArray(ordersData.deliveries)) {
                    arr = ordersData.deliveries as RawDeliveryRow[];
                } else if (Array.isArray(ordersData.data)) {
                    arr = ordersData.data as RawDeliveryRow[];
                } else if (Array.isArray(ordersData.orders)) {
                    arr = ordersData.orders as RawDeliveryRow[];
                } else {
                    arr = [];
                }

                // Normalize each row to our client Order shape as best-effort.
                const normalized = arr.map((d: RawDeliveryRow) => ({
                    deliveryId: d.delivery_id ?? d.id ?? '',
                    orderId: d.order_id ?? d.orderId ?? d.id ?? '',
                    address: d.address ?? d.delivery_address ?? d.shipping_address ?? '',
                    customerName: d.customer_name ?? d.customer ?? d.name ?? '',
                    customerContact: d.customer_contact ?? d.phone ?? d.contact ?? '',
                    items: (d.items ?? d.order_items ?? d.menu_items ?? []) as Array<string | { name?: string }>,
                    status: d.status ?? d.order_status ?? '',
                    createdAt: d.assigned_at ?? d.created_at ?? d.updated_at ?? '',
                }));

                if (mounted) setOrders(normalized as Order[]);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                console.error('Error fetching delivery data:', message);
                if (mounted) setError(message ?? 'Failed to load deliveries');
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchData().catch(err => console.error('Error fetching delivery data:', err));

        return () => {
            mounted = false;
        };
    }, []);

    // Derived stats
    const stats = {
        deliveriesToday: orders.length,
        pendingDeliveries: orders.filter(o => String(o.status).toLowerCase() !== 'delivered').length,
        completedDeliveries: orders.filter(o => String(o.status).toLowerCase() === 'delivered').length,
    };

    // Helper to normalize items to a readable string
    const itemsToString = (items?: Array<string | { name?: string }>) => {
        if (!items || items.length === 0) return '—';
        return items
            .map(i => (typeof i === 'string' ? i : i?.name ?? 'item'))
            .join(', ');
    };

    // Optimistic mark-as-delivered
    async function markAsDelivered(deliveryId: string | number) {
        setActionLoading(prev => ({ ...prev, [deliveryId]: true }));
        // Optimistic update (use same casing as backend: 'Delivered')
        const previous = orders.map(o => ({ ...o }));
        setOrders(prev => prev.map(o => (o.deliveryId === deliveryId ? { ...o, status: 'Delivered' } : o)));

        try {
            // Call backend endpoint that updates status (PUT /:id/status)
            // Backend expects capitalized 'Delivered' in some places; send the same.
            const res = await authFetch(`${API_URL}/api/deliveries/${deliveryId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: 'Delivered' })
            });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`Failed to mark delivered: ${res.status} ${text}`);
            }
            // Optionally refresh the order from server
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(message);
            setError(message ?? 'Failed to mark delivered');
            // revert optimistic update
            setOrders(previous);
        } finally {
            setActionLoading(prev => ({ ...prev, [deliveryId]: false }));
        }
    }

    return (
        <div className="min-h-screen mt-16 p-8">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Delivery Dashboard</h1>
                <p className="text-lg text-gray-600 mt-4">Track your stats and manage your delivery assignments.</p>
            </header>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="shadow-lg border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Deliveries Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-gray-800">{stats.deliveriesToday}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Pending Deliveries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-gray-800">{stats.pendingDeliveries}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Completed Deliveries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-gray-800">{stats.completedDeliveries}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Orders to Deliver</h2>
                    <div>
                        {loading && <span className="text-sm text-gray-500">Loading…</span>}
                        {error && <span className="text-sm text-red-600 ml-4">{error}</span>}
                    </div>
                </div>

                {loading ? (
                    <div className="text-gray-600">Fetching orders…</div>
                ) : orders.length === 0 ? (
                    <div className="text-gray-600">No delivery assignments yet.</div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card key={order.deliveryId} className="shadow-lg border border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Order #{order.orderId}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Address: {order.address ?? '—'}</p>
                                    <p className="text-gray-600">Customer: {order.customerName ?? '—'}</p>
                                    <p className="text-gray-600">Contact: {order.customerContact ?? '—'}</p>
                                    <p className="text-gray-600">Items: {itemsToString(order.items)}</p>
                                    <div className="mt-4">
                                        <Button
                                            disabled={String(order.status).toLowerCase() === 'delivered' || actionLoading[order.deliveryId]}
                                            onClick={() => markAsDelivered(order.deliveryId)}
                                        >
                                            {String(order.status).toLowerCase() === 'delivered' ? 'Delivered' : actionLoading[order.deliveryId] ? 'Marking…' : 'Mark as Delivered'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

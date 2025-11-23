'use client';

import OrdersList from '@/components/orders/OrdersList';
import {API_URL, authFetch, getToken} from '@/lib/api';
import {useEffect, useState} from 'react';
import type {ClientOrder, ServerOrder} from '@/types/orders';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Array<ServerOrder | ClientOrder>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (token) {
          const res = await authFetch(`${API_URL}/api/orders/my`, {cache: 'no-store'});
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            const arr = Array.isArray(data.orders) ? data.orders : (Array.isArray(data) ? data : []);
            if (mounted) setOrders(arr);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch my orders', err);
      }

      // fallback to client orders
      try {
        const local = await (await import('@/lib/orders')).getOrders();
        if (mounted) setOrders(local);
      } catch (e) {
        console.error('Failed to load local orders', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="mt-24 px-4 md:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Your orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Review your past orders and view invoices.</p>
      </header>

      {loading ? <div>Loading…</div> : <OrdersList orders={orders} role={"customer"} />}
    </main>
  );
}

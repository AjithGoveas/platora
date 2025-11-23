'use client';
import React, { useState } from 'react';
import type { Address } from '@/types/address';
import * as ordersLib from '@/lib/orders';
import { loadCart, toClientOrderItems, getCartSubtotal, clearCart } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CheckoutForm() {
  const router = useRouter();
  const [address, setAddress] = useState<Address>({ fullName: '', street: '', city: '', postcode: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const cart = loadCart();
  const items = toClientOrderItems(cart);
  const subtotal = getCartSubtotal(cart);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = subtotal + tax;

  const onChange = (k: keyof Address, v: string) => setAddress(prev => ({ ...prev, [k]: v }));

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!items || items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    if (!address.fullName || !address.street || !address.city || !address.postcode) {
      toast.error('Please complete the delivery address');
      return;
    }
    setLoading(true);
    try {
      const order = await ordersLib.createOrder({ items, subtotal, tax, total, address });
      // clear cart and cookies
      clearCart();
      try { document.cookie = 'cart=; Max-Age=0; path=/'; } catch {}
      toast.success('Order placed');
      // redirect to invoice page
      router.push(`/customer/invoices/${order.id}`);
    } catch (err) {
      console.error('Checkout failed', err);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium">Full name</label>
        <input value={address.fullName} onChange={(e) => onChange('fullName', e.target.value)} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Street address</label>
        <input value={address.street} onChange={(e) => onChange('street', e.target.value)} className="input" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium">City</label>
          <input value={address.city} onChange={(e) => onChange('city', e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Postcode</label>
          <input value={address.postcode} onChange={(e) => onChange('postcode', e.target.value)} className="input" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input value={address.phone} onChange={(e) => onChange('phone', e.target.value)} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Notes (optional)</label>
        <textarea value={address.notes} onChange={(e) => onChange('notes', e.target.value)} className="input" />
      </div>

      <div className="p-4 border rounded">
        <div className="flex justify-between"><div className="text-sm text-muted-foreground">Subtotal</div><div>{subtotal}</div></div>
        <div className="flex justify-between"><div className="text-sm text-muted-foreground">Tax</div><div>{tax}</div></div>
        <div className="flex justify-between font-semibold"><div>Total</div><div>{total}</div></div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Placing...' : 'Place order (assume payment)'}</Button>
      </div>
    </form>
  );
}

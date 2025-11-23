'use client';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {loadCart, saveCart} from '@/lib/cart';
import type {CartItem} from '@/types';
import {formatPrice} from '@/lib/utils';
import Link from 'next/link';
import {useEffect, useMemo, useState} from 'react';
import {toast} from 'sonner';
import CheckoutButton from '@/components/CheckoutButton';

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const load = () => {
            try {
                const parsed = loadCart();
                setCart(parsed);
            } catch (e) {
                setCart([]);
                console.error('Failed to load cart from localStorage', e);
            }
        };
        load();

        const onChange = () => load();
        window.addEventListener('cartChange', onChange);
        window.addEventListener('storage', onChange);
        return () => {
            window.removeEventListener('cartChange', onChange);
            window.removeEventListener('storage', onChange);
        };
    }, []);

    const save = (next: CartItem[]) => {
        setCart(next);
        try {
            saveCart(next);
        } catch (e) {
            toast.error('Failed to save cart');
            console.error('Failed to save cart', e);
        }
    };

    const updateQty = (menu_item_id: string | number, qty: number) => {
        if (qty < 0) return;
        const next = cart
            .map((c) => (String(c.menu_item_id) === String(menu_item_id) ? {...c, quantity: qty} : c))
            .filter((c) => (c.quantity || 0) > 0);
        save(next);
        toast.success('Cart updated');
    };

    const removeItem = (menu_item_id: string | number) => {
        const next = cart.filter((c) => String(c.menu_item_id) !== String(menu_item_id));
        save(next);
        toast.success('Removed from cart');
    };

    const total = useMemo(() => {
        return cart.reduce((sum, it) => {
            const unit = typeof it.unit_price === 'string' ? parseFloat(it.unit_price) : Number(it.unit_price || 0);
            if (Number.isNaN(unit)) return sum;
            return sum + unit * (it.quantity || 0);
        }, 0);
    }, [cart]);

    if (!cart.length) {
        return (
            <div className="mt-24 px-4 md:px-8">
                <header className="mb-4">
                    <h1 className="text-2xl font-semibold">Your cart</h1>
                </header>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                        <div className="mt-4">
                            <Link href="/customer/restaurants" className="text-rose-500 underline">
                                Continue browsing restaurants
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mt-24 px-4 md:px-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Your cart</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Review items, change quantities and proceed to checkout.
                </p>
            </header>

            <Card>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="text-sm text-muted-foreground">
                                <th className="py-2 px-3">Item</th>
                                <th className="py-2 px-3">Restaurant</th>
                                <th className="py-2 px-3">Unit Price</th>
                                <th className="py-2 px-3">Quantity</th>
                                <th className="py-2 px-3">Subtotal</th>
                                <th className="py-2 px-3">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cart.map((it) => {
                                const unit =
                                    typeof it.unit_price === 'string'
                                        ? parseFloat(it.unit_price)
                                        : Number(it.unit_price || 0);
                                const subtotal = (Number.isFinite(unit) ? unit : 0) * (it.quantity || 0);
                                return (
                                    <tr key={String(it.menu_item_id)} className="border-t">
                                        <td className="py-3 px-3 align-top">
                                            <div className="font-medium">{it.name || 'Item'}</div>
                                        </td>
                                        <td className="py-3 px-3 align-top">{it.restaurant_id ?? '-'}</td>
                                        <td className="py-3 px-3 align-top">{formatPrice(it.unit_price)}</td>
                                        <td className="py-3 px-3 align-top">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    aria-label={`Decrease quantity of ${it.name || 'item'}`}
                                                    className="px-2 py-1 border rounded disabled:opacity-50"
                                                    onClick={() =>
                                                        updateQty(it.menu_item_id, (it.quantity || 0) - 1)
                                                    }
                                                >
                                                    -
                                                </button>
                                                <div className="px-3" aria-live="polite">
                                                    {it.quantity}
                                                </div>
                                                <button
                                                    type="button"
                                                    aria-label={`Increase quantity of ${it.name || 'item'}`}
                                                    className="px-2 py-1 border rounded"
                                                    onClick={() =>
                                                        updateQty(it.menu_item_id, (it.quantity || 0) + 1)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 align-top">{formatPrice(subtotal)}</td>
                                        <td className="py-3 px-3 align-top">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" onClick={() => removeItem(it.menu_item_id)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 border rounded bg-slate-50 flex items-center justify-between mt-4">
                <div>
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-semibold text-lg">{formatPrice(total)}</div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (!confirm('Clear cart?')) return;
                            save([]);
                            toast.success('Cleared cart');
                        }}
                    >
                        Clear cart
                    </Button>
                    <CheckoutButton/>
                </div>
            </div>

            <div className="mt-6">
                <Link href="/" className="text-rose-500 underline">
                    Continue browsing restaurants
                </Link>
            </div>
        </div>
    );
}

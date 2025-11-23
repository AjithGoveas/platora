import React from 'react';
import CheckoutForm from '@/components/CheckoutForm';
import {getCartSubtotal, loadCart} from '@/lib/cart';
import {formatPrice} from '@/lib/utils';

export default function CheckoutPage() {
    const cart = loadCart();
    const subtotal = getCartSubtotal(cart);
    return (
        <div className="mt-24 px-4 md:px-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Checkout</h1>
                <p className="text-sm text-muted-foreground mt-1">Provide delivery details and confirm your order.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <CheckoutForm/>
                </div>
                <aside className="p-4 border rounded">
                    <h2 className="font-semibold mb-2">Order summary</h2>
                    <div className="space-y-2">
                        {cart.map((it) => (
                            <div key={String(it.menu_item_id)} className="flex justify-between text-sm">
                                <div>{it.name} x{it.quantity}</div>
                                <div>{formatPrice(Number(it.unit_price || 0) * (it.quantity || 0))}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 border-t pt-3">
                        <div className="flex justify-between">
                            <div className="text-sm text-muted-foreground">Subtotal</div>
                            <div>{formatPrice(subtotal)}</div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}


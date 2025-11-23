'use client';

import React, {useEffect, useRef, useState} from 'react';
import {toast} from 'sonner';
import SkeletonLoader from './SkeletonLoader';
import InvoiceModal from './InvoiceModal';
import {clearCart, loadCart} from '@/lib/cart';
import * as ordersLib from '@/lib/orders';
import type {ClientOrder, ClientOrderItem} from '@/types/orders';
import {Button} from '@/components/ui/button';

export default function CheckoutButton({}: object) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<ClientOrder | null>(null);
    const mountedRef = useRef(true);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    const handleCheckout = async () => {
        if (isProcessing) return;
        const cart = loadCart();
        if (!cart || cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setIsProcessing(true);
        toast('Working on payment');
        setShowInvoice(false);

        // show skeleton for 2.5s
        const delayMs = 2500;
        timerRef.current = window.setTimeout(async () => {
            try {
                // compute totals
                const items: ClientOrderItem[] = cart.map((c) => ({
                    menu_item_id: c.menu_item_id,
                    name: c.name,
                    unit_price: typeof c.unit_price === 'string' ? parseFloat(c.unit_price) : Number(c.unit_price || 0),
                    quantity: c.quantity || 0,
                }));

                const subtotal = items.reduce((s, it) => s + (it.unit_price || 0) * (it.quantity || 0), 0);
                const tax = Math.round(subtotal * 0.05 * 100) / 100; // simple 5% tax
                const total = Math.round((subtotal + tax) * 100) / 100;

                // Try server flow when token exists
                const {getToken} = await import('@/lib/api');
                const token = getToken();

                if (token) {
                    // Build server payload
                    const orderPayload = {
                        restaurant_id: cart[0]?.restaurant_id ?? null,
                        items: cart.map((c) => ({menu_item_id: c.menu_item_id, quantity: c.quantity || 1})),
                        payment_mode: 'COD',
                    };

                    try {
                        // Use authFetch to attach token
                        const {authFetch, API_URL} = await import('@/lib/api');
                        const res = await authFetch(`${API_URL}/api/orders`, {
                            method: 'POST',
                            body: JSON.stringify(orderPayload),
                        });

                        // handle failure without throwing so we can fall back
                        let serverFailed = false;

                        if (!res.ok) {
                            const txt = await res.text().catch(() => '');
                            console.error(`Order create failed: ${res.status} ${txt}`);
                            serverFailed = true;
                        }

                        // read response text and try to parse JSON safely
                        let dataObj: Record<string, unknown> = {};
                        if (!serverFailed) {
                            const text = await res.text().catch(() => '');
                            if (text) {
                                try {
                                    dataObj = JSON.parse(text);
                                } catch {
                                    dataObj = {};
                                }
                            }
                        }

                        let orderId: string | number | null = null;
                        if (!serverFailed) {
                            orderId = (typeof dataObj.orderId === 'string' || typeof dataObj.orderId === 'number')
                                ? dataObj.orderId
                                : (typeof dataObj.order_id === 'string' || typeof dataObj.order_id === 'number' ? dataObj.order_id : null);

                            if (!orderId) {
                                console.error('Order created but response missing order id');
                                serverFailed = true;
                            }
                        }

                        // If previous steps succeeded, attempt payment
                        if (!serverFailed) {
                            const payRes = await authFetch(`${API_URL}/api/payments/pay`, {
                                method: 'POST',
                                body: JSON.stringify({order_id: orderId, mode: 'COD'}),
                            });
                            if (!payRes.ok) {
                                const txt = await payRes.text().catch(() => '');
                                console.error(`Payment failed: ${payRes.status} ${txt}`);
                                serverFailed = true;
                            }
                        }

                        if (!serverFailed) {
                            // navigate to invoice page (use window.location for SPA navigation here)
                            if (typeof window !== 'undefined') {
                                window.location.href = `/customer/invoices/${orderId}`;
                            }

                            if (!mountedRef.current) return;
                            toast.success('Order placed');
                            return;
                        }

                        // if any server step failed, fall through to client-side fallback
                        console.error('Server checkout failed, falling back to client order');

                    } catch (serverErr) {
                        console.error('Server checkout failed, falling back to client order', serverErr);
                        // fall through to client-side order creation
                    }
                }

                // Client-side fallback (local orders)
                const created = await ordersLib.createOrder({items, subtotal, tax, total, address: undefined});

                // clear cart & cookies
                try {
                    clearCart();
                } catch {
                }
                try {
                    document.cookie = 'cart=; Max-Age=0; path=/';
                } catch {
                }

                if (!mountedRef.current) return;
                setCreatedOrder(created);
                setShowInvoice(true);
                toast.success('Order placed');
            } catch (e) {
                console.error('checkout failed', e);
                if (mountedRef.current) toast.error('Failed to complete checkout');
            } finally {
                if (mountedRef.current) setIsProcessing(false);
                timerRef.current = null;
            }
        }, delayMs);
    };

    return (
        <>
            <SkeletonLoader open={isProcessing}/>
            {/* When server flow is used we navigate to the invoice page; keep modal only for client fallback */}
            {showInvoice && <InvoiceModal open={showInvoice} order={createdOrder ?? undefined}
                                          onCloseAction={() => setShowInvoice(false)}/>}
            <Button onClick={handleCheckout} disabled={isProcessing} aria-busy={isProcessing}>
                {isProcessing ? 'Processing…' : 'Checkout'}
            </Button>
        </>
    );
}

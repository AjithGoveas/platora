'use client';

import React from 'react';
import type {ClientOrder} from '@/types/orders';
import {Button} from '@/components/ui/button';

type Props = {
    open: boolean;
    order?: ClientOrder | null;
    onCloseAction: () => void;
};

export default function InvoiceModal({open, order, onCloseAction}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40" onClick={onCloseAction}/>
            <div className="relative z-10 w-full max-w-2xl mx-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4 border-b">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">Invoice</h2>
                                <div className="text-sm text-muted-foreground">
                                    {order ? `Order ${order.id}` : 'Order'} • {order ? new Date(order.createdAt).toLocaleString() : ''}
                                </div>
                            </div>
                            <div>
                                <Button variant="ghost" onClick={onCloseAction}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {!order ? (
                            <div className="text-sm text-muted-foreground">No order data</div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    {order.items.map((it) => (
                                        <div key={String(it.menu_item_id)} className="flex justify-between">
                                            <div>
                                                <div className="font-medium">{it.name || 'Item'}</div>
                                                <div className="text-sm text-muted-foreground">Qty: {it.quantity}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">{(it.unit_price || 0).toFixed(2)}</div>
                                                <div
                                                    className="text-sm text-muted-foreground">{((it.unit_price || 0) * it.quantity).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <div>Subtotal</div>
                                        <div>{order.subtotal.toFixed(2)}</div>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <div>Tax</div>
                                        <div>{order.tax.toFixed(2)}</div>
                                    </div>
                                    <div className="flex justify-between mt-2 font-semibold text-lg">
                                        <div>Total</div>
                                        <div>{order.total.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t flex justify-end">
                        <Button onClick={onCloseAction}>Done</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

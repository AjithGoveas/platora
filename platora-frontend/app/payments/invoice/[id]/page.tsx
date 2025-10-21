'use client';

import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {useCartStore} from "@/store/cart";

export default function InvoicePage() {
    const { id } = useParams();
    const {items, clearCart} = useCartStore();

    const total = items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);


    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Invoice #{id}</h1>

            <Card className="p-4 space-y-4">
                <div>
                    <p><strong>Customer:</strong> Ajith</p>
                    <p><strong>Date:</strong> 03 Sep 2025</p>
                    <p><strong>Payment Method:</strong> Mock Card</p>
                </div>

                <div>
                    <h2 className="text-lg font-medium">Items</h2>
                    <ul className="text-sm text-muted-foreground list-disc pl-4 mt-2">
                        {items.map((item) => (
                            <li key={item.item.id}>
                                {item.item.name} × {item.quantity} — ₹{item.item.price * item.quantity}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-2 font-semibold">Total: ₹{total}</p>
                </div>

                <Button variant="outline" onClick={() => {
                    clearCart();
                    window.print()
                }}>
                    Download Invoice
                </Button>
            </Card>

        </div>
    );
}

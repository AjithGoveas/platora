'use client';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();

    const total = items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);

    const handleMockPayment = () => {
        router.push(`/payments/invoice/INV${Math.floor(Math.random() * 1000)}`);
    };

    return (
        <div className="p-6 max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Checkout</h1>

            <Card className="p-4 space-y-4">
                <div>
                    <h2 className="text-lg font-medium">Order Summary</h2>
                    <ul className="text-sm text-muted-foreground list-disc pl-4 mt-2">
                        {items.map((i) => (
                            <li key={i.item.id}>
                                {i.item.name} × {i.quantity} — ₹{i.item.price * i.quantity}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-2 font-semibold">Total: ₹{total}</p>
                </div>

                <div className="space-y-2">
                    <h2 className="text-lg font-medium">Mock Payment</h2>
                    <Input placeholder="Card Number" />
                    <div className="flex gap-2">
                        <Input placeholder="MM/YY" />
                        <Input placeholder="CVV" />
                    </div>
                    <Input placeholder="Cardholder Name" />
                </div>

                <Button className="w-full mt-4" onClick={handleMockPayment}>
                    Pay ₹{total}
                </Button>
            </Card>
        </div>
    );
}

'use client';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { IconTrash, IconMinus, IconPlus } from '@tabler/icons-react';

export default function CartPage() {
    const { items, removeItem, clearCart, updateQuantity } = useCartStore();

    const total = items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);

    return (
        <div className="p-6 space-y-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold">Your Cart</h1>

            {items.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {items.map((i) => (
                        <Card key={i.item.id} className="p-4 flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                    src={i.item.image || '/placeholder.svg'}
                                    alt={i.item.name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>

                            <div className="flex-1 space-y-1">
                                <h2 className="font-semibold">{i.item.name}</h2>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => updateQuantity(i.item.id, i.quantity - 1)}
                                        disabled={i.quantity <= 1}
                                    >
                                        <IconMinus size={16} />
                                    </Button>
                                    <span className="text-sm font-medium">{i.quantity}</span>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => updateQuantity(i.item.id, i.quantity + 1)}
                                    >
                                        <IconPlus size={16} />
                                    </Button>
                                </div>

                                <p className="text-sm font-medium">₹{i.item.price * i.quantity}</p>
                            </div>

                            <Button size="icon" variant="destructive" onClick={() => removeItem(i.item.id)}>
                                <IconTrash size={16} />
                            </Button>
                        </Card>
                    ))}

                    <div className="pt-4 flex justify-between items-center font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>

                    <Button className="w-full">
                        Proceed to Checkout
                    </Button>
                </div>
            )}
        </div>
    );
}

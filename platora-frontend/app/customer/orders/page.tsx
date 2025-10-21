'use client';

import { customerOrders } from '@/lib/dummy-data';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconClock, IconMapPin, IconPackage } from '@tabler/icons-react';

export default function CustomerOrdersPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Your Orders</h1>
            {customerOrders.length === 0 ? (
                <p className="text-muted-foreground">You haven’t placed any orders yet.</p>
            ) : (
                <div className="space-y-4">
                    {customerOrders.map((order) => (
                        <Card key={order.id} className="p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-bold">Order #{order.id.substring(0, 8)}...</h2>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        <IconMapPin size={16} />
                                        <span>{order.restaurant}</span>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs">{order.status.toUpperCase()}</Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.items.map((i) => (
                                    <div key={i.item.id} className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                        <span>{i.item.name} × {i.quantity}</span>
                                        <span>₹{i.item.price * i.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <IconClock size={16} />
                                    <span>ETA: {order.eta}</span>
                                </div>
                                <Link href={`/customer/track/${order.id}`}>
                                    <Button size="sm" variant="outline">
                                        <IconPackage size={16} className="mr-2" />
                                        Track Order
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
'use client';

import {useEffect} from 'react';
import {useDeliveryStore} from '@/store/delivery';
import {deliveryOrders} from '@/lib/dummy-data';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {DeliveryStatus} from "@/types/delivery";

export default function DeliveryDashboardPage() {
    const { orders, setOrders, updateStatus } = useDeliveryStore();

    useEffect(() => {
        setOrders(deliveryOrders);
    }, [setOrders]);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Delivery Dashboard</h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                    <Card key={order.id} className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold">{order.restaurant}</h2>
                            <Badge variant="outline">{order.status.toUpperCase()}</Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Deliver to <strong>{order.customer}</strong> — {order.address}
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Items: {order.items.join(', ')}
                        </p>

                        <p className="text-xs text-muted-foreground">ETA: {order.eta}</p>

                        <div className="flex gap-2 pt-2">
                            {order.status === 'assigned' && (
                                <Button size="sm" onClick={() => updateStatus(order.id, DeliveryStatus.PICKED)}>
                                    Mark as Picked
                                </Button>
                            )}
                            {order.status === 'picked' && (
                                <Button size="sm" onClick={() => updateStatus(order.id, DeliveryStatus.DELIVERED)}>
                                    Mark as Delivered
                                </Button>
                            )}
                            <Link href={`/delivery/order/${order.id}`}>
                                <Button size="sm" variant="outline">Details</Button>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
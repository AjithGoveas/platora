'use client';

import {useParams} from 'next/navigation';
import {useDeliveryStore} from '@/store/delivery';
import {Button} from '@/components/ui/button';
import {DeliveryStatus} from "@/types/delivery";
import {useEffect} from "react";
import {deliveryOrders} from "@/lib/dummy-data";

export default function DeliveryOrderPage() {
    useEffect(() => {
        setOrders(deliveryOrders)
    }, [deliveryOrders])
    const { id } = useParams();
    const { orders, setOrders, updateStatus } = useDeliveryStore();
    const order = orders.find((o) => o.id === id);

    if (!order) return <p className="p-6">Order not found.</p>;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Delivery Details</h1>
            <div className="space-y-2">
                <p><strong>Restaurant:</strong> {order.restaurant}</p>
                <p><strong>Customer:</strong> {order.customer}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Items:</strong> {order.items.join(', ')}</p>
                <p><strong>Status:</strong> {order.status.toUpperCase()}</p>
                <p><strong>ETA:</strong> {order.eta}</p>
            </div>
            <div className="flex gap-2 pt-4">
                {order.status === 'assigned' && (
                    <Button onClick={() => updateStatus(order.id, DeliveryStatus.PICKED)}>Mark as Picked</Button>
                )}
                {order.status === 'picked' && (
                    <Button onClick={() => updateStatus(order.id, DeliveryStatus.DELIVERED)}>Mark as Delivered</Button>
                )}
            </div>
        </div>
    );
}

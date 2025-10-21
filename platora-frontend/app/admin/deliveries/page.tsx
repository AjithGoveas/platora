'use client';

import { deliveryOrders } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DeliveriesPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Delivery Assignments</h1>

            <div className="space-y-4">
                {deliveryOrders.map((d) => (
                    <Card key={d.id} className="p-4 space-y-1">
                        <p><strong>Order:</strong> {d.id}</p>
                        <p><strong>Customer:</strong> {d.customer}</p>
                        <p><strong>Address:</strong> {d.address}</p>
                        <p><strong>Status:</strong> {d.status}</p>
                        <Button size="sm" variant="outline">Reassign</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}

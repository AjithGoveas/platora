'use client';

import { useParams } from 'next/navigation';
import { customerOrders } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types/orders';
import { IconCheck } from '@tabler/icons-react';

export default function TrackOrderPage() {
    const { id } = useParams();
    const order = customerOrders.find((o) => o.id === id);

    if (!order) return <p className="p-6">Order not found.</p>;

    const statusSteps: OrderStatus[] = [
        OrderStatus.PENDING,
        OrderStatus.ACCEPTED,
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.DELIVERED,
    ];

    const currentIndex = statusSteps.indexOf(order.status);

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-semibold">Tracking Order #{order.id}</h1>

            <Card className="p-4 space-y-2">
                <p><strong>Restaurant:</strong> {order.restaurant}</p>
                <p><strong>Status:</strong> <Badge variant="outline">{order.status.toUpperCase()}</Badge></p>
                <p><strong>ETA:</strong> {order.eta}</p>
            </Card>

            <div className="space-y-6">
                <h2 className="text-lg font-medium">Progress</h2>

                <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto py-8">
                    {/* Main Progress Line */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-gray-300 rounded-full">
                        <div
                            className="h-full bg-green-600 rounded-full transition-all duration-300"
                            style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                        />
                    </div>

                    {/* Step markers and labels */}
                    {statusSteps.map((step, idx) => {
                        const isCompleted = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;

                        return (
                            <div key={step} className="relative flex flex-col items-center z-10">
                                {/* Dot */}
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center translate-y-1/2 transition-all duration-300 ${
                                        isCompleted ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'
                                    } ${isCurrent ? 'scale-110' : ''}`}
                                >
                                    {isCompleted && (
                                        <IconCheck
                                            className={`text-white transition-opacity duration-300 ${
                                                isCompleted ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        />
                                    )}
                                </div>

                                {/* Label */}
                                <p
                                    className={`mt-4 text-xs md:text-sm whitespace-nowrap transition-all duration-300 ${
                                        isCompleted ? 'text-green-700 font-medium' : 'text-gray-500'
                                    }`}
                                >
                                    {step.charAt(0).toUpperCase() + step.slice(1)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
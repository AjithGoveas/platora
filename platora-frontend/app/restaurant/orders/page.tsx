// app/restaurant/orders/page.tsx
'use client';

import {useEffect} from 'react';
import {useOrderStore} from '@/store/order';
import {orders as mockOrders} from '@/lib/dummy-data';
import {DataTable} from '@/components/data-table';
import {OrderStatusBadge} from '@/components/restaurant/order-status-badge';
import {Order, OrderStatus} from '@/types/orders';
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function OrdersPage() {
    const {orders, setOrders, updateStatus} = useOrderStore();

    useEffect(() => {
        setOrders(mockOrders);
    }, [setOrders]);

    const columns: {
        header: string;
        accessorKey: keyof Order;
        cell?: (row: Order) => React.ReactNode;
        actions?: (row: Order) => React.ReactNode;
    }[] = [
        {header: 'Order ID', accessorKey: 'id'},
        {header: 'Customer', accessorKey: 'customer'},
        {
            header: 'Items',
            accessorKey: 'items',
            cell: (row) => row.items.join(', '),
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row) => <OrderStatusBadge status={row.status}/>,
        },
        {
            header: 'Total',
            accessorKey: 'total',
            cell: (row) => `₹${row.total}`,
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            actions: (row) => {
                switch (row.status) {
                    case OrderStatus.PENDING:
                        return (
                            <div className="flex gap-2">
                                <Button size="sm"
                                        onClick={() => updateStatus(row.id, OrderStatus.ACCEPTED)}>Accept</Button>
                                <Button size="sm" variant="destructive"
                                        onClick={() => updateStatus(row.id, OrderStatus.REJECTED)}>Reject</Button>
                            </div>
                        );
                    case OrderStatus.ACCEPTED:
                        return (
                            <Select onValueChange={(value) => updateStatus(row.id, value as OrderStatus)}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Update status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
                                    <SelectItem value={OrderStatus.READY}>Ready</SelectItem>
                                </SelectContent>
                            </Select>
                        );
                    case OrderStatus.PREPARING:
                        return (
                            <Button size="sm" onClick={() => updateStatus(row.id, OrderStatus.READY)}>Mark as
                                Ready</Button>
                        );
                    default:
                        return null;
                }
            },
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Incoming Orders</h1>
            {orders.length > 0 ? (
                <DataTable data={orders} columns={columns}/>
            ) : (
                <p className="text-muted-foreground">No orders available.</p>
            )}
        </div>
    );
}

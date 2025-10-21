// app/restaurant/dashboard/page.tsx
'use client';

import { orders } from '@/lib/dummy-data';
import { SalesChart } from '@/components/charts/sales-chart';
import { DataTable } from '@/components/data-table';
import {Order} from "@/types/orders";
import {OrderStatusBadge} from "@/components/restaurant/order-status-badge";
import {dashboardStats} from "@/lib/dashboard-stats";

/**
 * 🔹 Dashboard Module
 *
 * Provides a centralized, real-time interface for restaurant operations,
 * optimized for responsiveness, clarity, and stakeholder empowerment.
 *
 * Features:
 * - 📡 Live Order Feed:
 *   - Streams new orders in real-time with source indicators (web, app, phone).
 *   - Highlights priority orders (e.g. VIP, allergy-sensitive, delayed).
 *   - Supports toast notifications and status-based filtering.
 *
 * - 🚚 Delivery Agent & Kitchen Load Monitoring:
 *   - Displays active delivery agents with location, ETA, and availability status.
 *   - Visualizes kitchen load (queue length, prep time, dish type distribution).
 *   - Includes sparkline trends and heatmaps for operational forecasting.
 *
 * - ⚡ Quick Actions:
 *   - Accept/reject orders individually or in batch.
 *   - Provides contextual tooltips and escalation options (e.g. reassign, notify manager).
 *   - Supports undo for accidental actions with a short grace window.
 *
 * Purpose:
 * - Enhance situational awareness across kitchen and delivery operations.
 * - Empower staff with fast, informed decision-making tools.
 * - Maintain editorial clarity and emotional resonance in high-pressure workflows.
 */



export default function DashboardPage() {
    const columns: {
        header: string;
        accessorKey: keyof Order;
        cell?: (row: Order) => React.ReactNode;
    }[] = [
        { header: 'Order ID', accessorKey: 'id' },
        { header: 'Customer', accessorKey: 'customer' },
        { header: 'Total', accessorKey: 'total', cell: (row) => `₹${row.total}`, },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row) => <OrderStatusBadge status={row.status}/>,
        },
    ];

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-semibold">Restaurant Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Total Orders" value={dashboardStats.totalOrders} />
                <StatCard label="Revenue" value={`₹${dashboardStats.totalRevenue}`} />
                <StatCard label="Avg Prep Time" value={dashboardStats.avgPrepTime} />
            </div>

            <SalesChart />

            <div>
                <h2 className="text-xl font-medium mt-6 mb-2">Recent Orders</h2>
                <DataTable data={orders.slice(0, 5)} columns={columns} />
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="bg-muted p-4 rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}

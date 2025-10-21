'use client';

import { dashboardStats } from '@/lib/dashboard-stats';
import { SalesChart } from '@/components/charts/sales-chart';

export default function GlobalReportsPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Global Analytics</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Total Orders" value={dashboardStats.totalOrders} />
                <StatCard label="Revenue" value={`₹${dashboardStats.totalRevenue}`} />
                <StatCard label="Avg Prep Time" value={dashboardStats.avgPrepTime} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SalesChart />
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

'use client';

import { dashboardStats } from '@/lib/dashboard-stats';
import { Card } from '@/components/ui/card';

export default function AdminDashboard() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Total Orders" value={dashboardStats.totalOrders} />
                <StatCard label="Revenue" value={`₹${dashboardStats.totalRevenue}`} />
                <StatCard label="Avg Prep Time" value={dashboardStats.avgPrepTime} />
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <Card className="p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </Card>
    );
}

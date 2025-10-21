'use client';

import {dashboardStats} from '@/lib/dashboard-stats';
import {Card} from '@/components/ui/card';
import {SalesChart} from '@/components/charts/sales-chart';

export default function ReportsPage() {
    const {totalOrders, totalRevenue, avgPrepTime, statusBreakdown, topCustomers} = dashboardStats;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <h2 className="text-xl font-bold">{totalOrders}</h2>
                </Card>
                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <h2 className="text-xl font-bold">₹{totalRevenue}</h2>
                </Card>
                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Avg Prep Time</p>
                    <h2 className="text-xl font-bold">{avgPrepTime}</h2>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SalesChart/>
            </div>
        </div>
    );
}

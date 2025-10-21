import {DashboardStats} from "@/types/dashboard-stats";
import {orders} from "@/lib/dummy-data";

export const dashboardStats: DashboardStats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    avgPrepTime: '18 mins',
    statusBreakdown: {
        pending: orders.filter((o) => o.status === 'pending').length,
        accepted: orders.filter((o) => o.status === 'accepted').length,
        preparing: orders.filter((o) => o.status === 'preparing').length,
        ready: orders.filter((o) => o.status === 'ready').length,
        delivered: orders.filter((o) => o.status === 'delivered').length,
        rejected: orders.filter((o) => o.status === 'rejected').length,
        cancelled: orders.filter((o) => o.status === 'cancelled_by_user').length,
    },
    topCustomers: Array.from(
        orders.reduce((map, order) => {
            map.set(order.customer, (map.get(order.customer) || 0) + order.total);
            return map;
        }, new Map<string, number>())
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, total]) => ({name, total})),
};
export type DashboardStats = {
    totalOrders: number;
    totalRevenue: number;
    avgPrepTime: string;
    statusBreakdown: {
        pending: number;
        accepted: number;
        preparing: number;
        ready: number;
        delivered: number;
        rejected: number;
        cancelled: number;
    };
    topCustomers: {
        name: string;
        total: number;
    }[];
};

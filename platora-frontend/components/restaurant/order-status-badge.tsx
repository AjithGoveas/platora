// components/order-status-badge.tsx
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types/orders';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const statusMap: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        [OrderStatus.PENDING]: { label: 'Pending', variant: 'outline' },
        [OrderStatus.ACCEPTED]: { label: 'Accepted', variant: 'default' },
        [OrderStatus.PREPARING]: { label: 'Preparing', variant: 'secondary' },
        [OrderStatus.READY]: { label: 'Ready', variant: 'default' },
        [OrderStatus.DELIVERED]: { label: 'Delivered', variant: 'secondary' },
        [OrderStatus.REJECTED]: { label: 'Rejected', variant: 'destructive' },
        [OrderStatus.CANCELLED_BY_USER]: { label: 'Cancelled by User', variant: 'destructive' },
    };

    const { label, variant } = statusMap[status];

    return <Badge variant={variant}>{label}</Badge>;
}

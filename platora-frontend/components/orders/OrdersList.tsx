import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {formatPrice} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useState} from 'react'
import {ClientOrder, ServerOrder, ServerOrderItem, ClientOrderItem} from "@/types/orders";
import {Role} from "@/types";
import {pick} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type OrderParams = {
    orders: Array<ServerOrder | ClientOrder>;
    role: Role;
}

export default function OrdersList({orders, role}: OrderParams) {
    const user_role = role === 'restaurant' ? 'restaurant' : 'customer';
    const [expanded, setExpanded] = useState<Record<string|number, boolean>>({})
    const toggleExpand = (k: string|number) => setExpanded(prev => ({...prev, [k]: !prev[k]}))

    return (
        <div className="space-y-4">
            {orders.length === 0 && <div className="text-sm text-muted-foreground">No orders found.</div>}
            {orders.map((o, idx) => {
                // Both ServerOrder and ClientOrder have `id` (ClientOrder.id is string)
                const maybeId = (o as unknown) && (o as unknown as Record<string, unknown>)['id'];
                const key: string | number = typeof maybeId === 'string' || typeof maybeId === 'number' ? (maybeId as string | number) : `local_${idx}`;

                const isServer = (o as ServerOrder).total_amount !== undefined && (o as ServerOrder).created_at !== undefined;
                const createdAt = isServer ? (o as ServerOrder).created_at : (o as ClientOrder).createdAt;
                const total = isServer ? (o as ServerOrder).total_amount : (o as ClientOrder).total;
                const items = isServer ? (o as ServerOrder).items ?? [] : (o as ClientOrder).items ?? [];
                const customer = isServer ? (o as ServerOrder).customer_name : undefined;
                const assignedAgent = isServer ? ((o as ServerOrder).delivery_agent_name ? {
                    name: (o as ServerOrder).delivery_agent_name,
                    phone: (o as ServerOrder).delivery_agent_phone
                } : undefined) : (o as ClientOrder).assignedAgent;
                const status = isServer ? (o as ServerOrder).status : (o as ClientOrder).status;

                return (
                    <Card key={String(key)}>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                                <CardTitle className="flex items-center gap-3">
                                    <span>Order #{String(key)}</span>
                                    {/* small meta: items count */}
                                    <span className="text-xs text-muted-foreground">• {items.length} item{items.length !== 1 ? 's' : ''}</span>
                                </CardTitle>
                                <div className="text-sm text-muted-foreground mt-1">{customer ? `Customer: ${customer}` : 'Customer: —'}</div>
                            </div>

                            <div className="flex items-start sm:items-end gap-4 text-right">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-end gap-2">
                                        {
                                            (() => {
                                                const s = String(status ?? '').toLowerCase();
                                                if (!s || s === 'null') return <Badge variant="warning">—</Badge>;
                                                if (s === 'cancelled' || s === 'canceled') return <Badge variant="destructive">{status}</Badge>;
                                                if (s === 'delivered') return <Badge variant="success">{status}</Badge>;
                                                return <Badge variant="warning">{status}</Badge>;
                                            })()
                                        }
                                        <div className="font-semibold">{formatPrice(Number(total ?? 0))}</div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">Created: {createdAt ? new Date(String(createdAt)).toLocaleString() : '—'}</div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => toggleExpand(key)} aria-expanded={expanded[String(key)]}>
                                        {expanded[String(key)] ? 'Hide items' : `Items (${items.length})`}
                                    </Button>
                                    <Button size="sm" asChild>
                                        <Link href={`/${user_role}/invoices/${key}`}>View invoice</Link>
                                    </Button>
                                </div>

                                {assignedAgent ? (
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="text-sm text-muted-foreground">Delivery:</div>
                                        <div className="px-2 py-1 rounded bg-muted text-sm font-medium">{assignedAgent.name}</div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">No delivery person assigned</div>
                                )}
                            </div>

                            {expanded[String(key)] && (
                                <div className="mt-2 space-y-3">
                                    {items.length === 0 && <div className="text-sm text-muted-foreground">No items</div>}
                                    {items.map((it, itIdx) => {
                                        const name = (it as ServerOrderItem).name ?? (it as ClientOrderItem).name ?? 'Item';
                                        const qty = Number((it as ServerOrderItem).quantity ?? (it as ClientOrderItem).quantity ?? 0);
                                        const unit = Number(pick<number>(it, ['unit_price', 'unitPrice'], undefined) ?? (it as ClientOrderItem).unit_price ?? 0);
                                        const lineTotal = qty * unit;
                                        const itemKey = (it as ServerOrderItem).menu_item_id ?? (it as ClientOrderItem).menu_item_id ?? `i${itIdx}`;
                                        return (
                                            <div key={`${String(itemKey)}_${itIdx}`} className="flex items-center justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="font-medium truncate">{name}</div>
                                                    <div className="text-xs text-muted-foreground">Qty: {qty}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div>{formatPrice(unit)}</div>
                                                    <div className="text-sm text-muted-foreground">{formatPrice(lineTotal)}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
                ;
             })}
         </div>
     )
 }

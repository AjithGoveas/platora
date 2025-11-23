'use client'

import {useEffect, useMemo, useState} from 'react'
import {useParams} from 'next/navigation'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {formatDate, getErrorMessage, pick} from '@/lib/utils'
import {API_URL, authFetch, getToken} from '@/lib/api'
import * as ordersLib from '@/lib/orders'
import type {ClientOrder, Delivery as DeliveryType, Order, OrderItem} from '@/types'
import Link from "next/link";
import BillingDetails from '@/components/BillingDetails'
import InvoiceItems from '@/components/InvoiceItems'
import InvoiceAside from '@/components/InvoiceAside'

type ServerInvoice = {
    id?: string | number
    order_id?: string | number
    amount?: number
    currency?: string | null
    mode?: string | null
    paid_at?: string | null
    invoice_text?: string | null
    generated_at?: string | null
}

export default function InvoicePage() {
    const params = useParams() as { id?: string }
    const id = String(params?.id ?? '').trim()

    const [loading, setLoading] = useState(true)
    const [invoice, setInvoice] = useState<ServerInvoice | null>(null)
    const [serverOrder, setServerOrder] = useState<{
        order: Partial<Order>;
        items: OrderItem[];
        delivery: Partial<DeliveryType> | null
    } | null>(null)
    const [clientOrder, setClientOrder] = useState<ClientOrder | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        setInvoice(null)
        setServerOrder(null)
        setClientOrder(null)
        setError(null)

        const load = async () => {
            if (!id) {
                if (mounted) {
                    setError('Invalid invoice id')
                    setLoading(false)
                }
                return
            }

            // server-side enriched invoice (preferred)
            try {
                const token = getToken()
                if (token) {
                    const res = await authFetch(`${API_URL}/api/payments/invoice/${id}`, {cache: 'no-store'})
                    if (res.ok) {
                        const data = await res.json().catch(() => ({}))
                        // backend should return: { invoice, order, items, delivery }
                        if (mounted) {
                            if (data.order) {
                                setServerOrder({
                                    order: data.order ?? {},
                                    items: Array.isArray(data.items) ? data.items : [],
                                    delivery: data.delivery ?? null
                                })
                                setInvoice(data.invoice ?? null)
                            } else if (data.invoice) {
                                setInvoice(data.invoice)
                            }
                        }
                        if (mounted) setLoading(false)
                        return
                    }
                    if (res.status !== 404) {
                        const txt = await res.text().catch(() => '')
                        if (mounted) setError(`Server returned ${res.status} ${txt}`)
                        if (mounted) setLoading(false)
                        return
                    }
                }
            } catch (err) {
                if (mounted) setError(getErrorMessage(err))
            }

            // client fallback: local orders saved in localStorage
            try {
                const co = await ordersLib.getOrderById(id)
                if (co && mounted) setClientOrder(co)
            } catch (err) {
                console.error('Failed to load client order', err)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        // kick off load; use void to explicitly ignore the promise in a way that linters understand
        void load()
        return () => {
            mounted = false
        }
    }, [id])

    // source selection: server order (rich) preferred, else client order
    const source = useMemo(() => {
        if (serverOrder) return {
            type: 'server' as const,
            order: serverOrder.order,
            items: serverOrder.items,
            delivery: serverOrder.delivery,
            invoice
        }
        if (clientOrder) return {
            type: 'client' as const,
            order: null,
            items: clientOrder.items,
            delivery: clientOrder.assignedAgent ?? null,
            invoice: null
        }
        return null
    }, [serverOrder, clientOrder, invoice])

    // helpers for items and totals (use pick to avoid unsafe casts)
    const getItemName = (it: unknown) => pick<string>(it, ['name', 'title'], undefined) ?? pick<string>(it, ['item_name', 'menu_item_name'], undefined) ?? 'Item'
    const getItemQty = (it: unknown) => Number(pick<number>(it, ['quantity', 'qty'], undefined) ?? 0)
    const getItemUnit = (it: unknown) => Number(pick<number>(it, ['unit_price', 'unitPrice', 'price'], undefined) ?? 0)

    const items = source?.items ?? []
    const createdAt = source?.type === 'server' ? pick<string>(source.order, ['created_at', 'createdAt'], undefined) : clientOrder?.createdAt
    const invoiceNumber = invoice?.id ?? (source?.type === 'server' ? (pick<string | number>(source.order, ['id', 'order_id', 'orderId'], undefined) as string | number | undefined) : clientOrder?.id) ?? id
    const invoiceDate = invoice?.generated_at ?? invoice?.paid_at ?? createdAt
    const paymentMode = invoice?.mode ?? (source?.type === 'server' ? pick<string>(source.order, ['payment_mode', 'paymentMode', 'mode'], undefined) : undefined)

    const subtotal = (() => {
        if (source?.type === 'client') return clientOrder?.subtotal ?? items.reduce((s, it) => s + getItemUnit(it) * getItemQty(it), 0)
        const byItems = items.reduce((s, it) => s + getItemUnit(it) * getItemQty(it), 0)
        if (byItems > 0) return byItems
        // fallback to server-reported total_amount or invoice.amount
        const serverTotal = source?.order ? pick<number | string>(source.order, ['total_amount', 'total', 'totalAmount'], undefined) : undefined
        return Number(serverTotal ?? invoice?.amount ?? 0)
    })()

    const tax = source?.type === 'client' ? (clientOrder?.tax ?? 0) : 0
    const total = Number(pick<number | string>(source?.order, ['total_amount', 'total', 'totalAmount'], undefined) ?? invoice?.amount ?? subtotal + tax)

    const restaurantName = pick<string>(source?.order, ['restaurant_name', 'restaurantName', 'restaurant'], undefined)
    const restaurantAddress = pick<string>(source?.order, ['restaurant_address', 'restaurantAddress', 'restaurant_address'], undefined)
    const customerName = pick<string>(source?.order, ['customer_name', 'customerName', 'customer'], undefined) ?? (clientOrder ? 'Guest customer' : undefined)
    const customerPhone = pick<string>(source?.order, ['customer_phone', 'customerPhone', 'phone', 'contact'], undefined)

    // Delivery fields (source.delivery can be server delivery row or client assignedAgent)
    const deliveryStatus = source?.delivery ? pick<string>(source.delivery, ['status', 'delivery_status'], undefined) : undefined
    const deliveryAgentName = source?.delivery ? pick<string>(source.delivery, ['delivery_agent_name', 'deliveryAgentName', 'name'], undefined) : undefined
    const deliveryAgentPhone = source?.delivery ? pick<string>(source.delivery, ['delivery_agent_phone', 'deliveryAgentPhone', 'phone'], undefined) : undefined

    return (
        <main className="mt-24 px-4 md:px-8">
            <header className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Invoice</h1>
                    <div className="text-sm text-muted-foreground mt-1">Invoice #{String(invoiceNumber)}</div>
                    {source?.type === 'client' &&
                        <div className="text-xs text-muted-foreground">(Offline / local)</div>}
                </div>

                <div className="text-right">
                    <div className="text-sm">{formatDate(invoiceDate)}</div>
                    <div className="mt-2 flex gap-2 justify-end">
                        <Button variant="outline" asChild>
                            <Link href={`/restaurant/orders`}>Back</Link>
                        </Button>
                        <Button onClick={() => window.print()}>Print</Button>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="text-sm text-muted-foreground">Loading…</div>
            ) : source ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <section className="md:col-span-2">
                        <BillingDetails
                            customerName={customerName ?? (clientOrder ? clientOrder.id : 'Customer')}
                            customerPhone={customerPhone}
                            paymentMode={paymentMode}
                            invoice={invoice}
                            restaurantName={restaurantName}
                            restaurantAddress={restaurantAddress}
                            deliveryStatus={source?.delivery ? String(deliveryStatus ?? '—') : undefined}
                            deliveryAgentName={deliveryAgentName}
                            deliveryAgentPhone={deliveryAgentPhone}
                        />

                        <InvoiceItems
                          items={items}
                          subtotal={subtotal ?? 0}
                          tax={tax ?? 0}
                          total={total ?? 0}
                          getItemName={getItemName}
                          getItemQty={getItemQty}
                          getItemUnit={getItemUnit}
                        />
                    </section>

                    <aside>
                        <InvoiceAside invoice={invoice} total={total ?? 0} />

                        {clientOrder && clientOrder.assignedAgent && (
                            <Card className="mt-4">
                                <CardHeader>
                                    <CardTitle>Delivery person</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>{clientOrder.assignedAgent.name}</div>
                                    {clientOrder.assignedAgent.phone && <div
                                        className="text-sm text-muted-foreground">Phone: {clientOrder.assignedAgent.phone}</div>}
                                </CardContent>
                            </Card>
                        )}
                    </aside>
                </div>
            ) : (
                <Card>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">No invoice or order found for
                            id {id || '(unknown)'}.
                        </div>
                        {error && <div className="mt-2 text-sm text-rose-600">{error}</div>}
                    </CardContent>
                </Card>
            )}
        </main>
    )
}

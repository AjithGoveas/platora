'use client'

import OrdersList from '@/components/orders/OrdersList'
import {API_URL, authFetch} from '@/lib/api'
import {getToken} from '@/lib/api'
import {useEffect, useState} from 'react'
import type {ServerOrder, ClientOrder} from '@/types/orders'

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<Array<ServerOrder | ClientOrder>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const token = getToken()
        if (token) {
          const res = await authFetch(`${API_URL}/api/orders/restaurant`, { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json().catch(() => ({}))
            const arr = Array.isArray(data.orders) ? data.orders : (Array.isArray(data) ? data : [])
            if (mounted) setOrders(arr)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('Failed to fetch restaurant orders', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <main className="mt-24 px-4 md:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Restaurant orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Orders for your restaurant</p>
      </header>

      {loading ? <div>Loading…</div> : <OrdersList orders={orders} role={"restaurant"}/>}
    </main>
  )
}

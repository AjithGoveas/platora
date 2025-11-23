// Grouped order-related types

export type OrderStatus =
  | 'Pending'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'

export type Order = {
  id?: number | string
  customer_id?: number | null
  restaurant_id?: number | null
  total_amount?: number | string
  status?: OrderStatus
  payment_mode?: string | null
  created_at?: string | null
}

export type OrderItem = {
  id?: number | string
  order_id?: number | string
  menu_item_id?: number | string | null
  quantity?: number
  unit_price?: number | string
  name?: string
}

// Types used for frontend-local persisted orders (client-side)
export type ClientOrderItem = {
  menu_item_id: number | string
  name?: string
  unit_price?: number
  quantity: number
}

export type ClientOrder = {
  id: string
  items: ClientOrderItem[]
  subtotal: number
  tax: number
  total: number
  createdAt: string // ISO string
  status?: OrderStatus | string
  metadata?: Record<string, unknown>
  // frontend additions
  address?: {
    fullName: string
    street: string
    city: string
    postcode: string
    phone?: string
    notes?: string
  }
  assignedAgent?: { id: string | number; name: string; phone?: string | null }
}

// Server-specific shapes (when backend returns combined rows)
export type ServerOrderItem = OrderItem

export type ServerOrder = {
  id: number | string
  customer_name?: string | null
  created_at?: string | null
  total_amount?: number | string
  status?: string | null
  payment_mode?: string | null
  items?: ServerOrderItem[]
  // delivery fields may be joined in some queries
  delivery_agent_id?: number | null
  delivery_agent_name?: string | null
  delivery_agent_phone?: string | null
}

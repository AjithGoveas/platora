export type DeliveryStatus = 'Assigned' | 'Picked' | 'On the Way' | 'Delivered'

export type Delivery = {
  id?: number | string
  order_id?: number | string
  delivery_agent_id?: number | null
  status?: DeliveryStatus
  assigned_at?: string | null
  updated_at?: string | null
}

export type DeliveryAgent = {
  id: string | number
  name: string
  phone?: string | null
  vehicle?: string | null
}


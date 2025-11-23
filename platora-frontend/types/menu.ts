export type MenuItem = {
  id: number | string
  restaurant_id?: number | string
  name: string
  description?: string | null
  price?: number | string
  is_available?: boolean
}

export type Restaurant = {
  id: number
  user_id?: number
  name: string
  address?: string | null
  phone?: string | null
  owner_name?: string | null
  owner_email?: string | null
  is_active?: boolean
  created_at?: string | null
}


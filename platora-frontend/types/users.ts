export type Role = 'admin' | 'customer' | 'restaurant' | 'delivery'

export type User = {
  id?: number | string
  email: string
  password_hash?: string
  name?: string | null
  phone?: string | null
  role?: Role
  avatar_url?: string | null
  avatarUrl?: string | null
  created_at?: string | null
}


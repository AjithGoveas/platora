export type Restaurant = {
  id: number;
  user_id?: number;
  name: string;
  address?: string | null;
  phone?: string | null;
  owner_name?: string | null;
  owner_email?: string | null;
  is_active?: boolean;
  created_at?: string | null;
};

export type MenuItem = {
  id: number | string;
  restaurant_id?: number | string;
  name: string;
  description?: string | null;
  price?: number | string;
  is_available?: boolean;
};

// --- User ---
export type Role = 'admin' | 'customer' | 'restaurant' | 'delivery';

export type User = {
  id?: number | string;
  email: string;
  password_hash?: string; // present on server but usually not used on client
  name?: string | null;
  phone?: string | null;
  role?: Role;
  avatar_url?: string | null;
  avatarUrl?: string | null; // frontend-friendly camelCase alias
  created_at?: string | null;
};

// --- Cart item stored in localStorage on the frontend ---
export type CartItem = {
  menu_item_id: number | string;
  restaurant_id?: number | string;
  name?: string;
  unit_price?: number | string;
  quantity: number;
};

// --- Orders & related types ---
export type OrderStatus =
  | 'Pending'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type Order = {
  id?: number | string;
  customer_id?: number | null;
  restaurant_id?: number | null;
  total_amount?: number | string;
  status?: OrderStatus;
  payment_mode?: string | null;
  created_at?: string | null;
};

export type OrderItem = {
  id?: number | string;
  order_id?: number | string;
  menu_item_id?: number | string | null;
  quantity?: number;
  unit_price?: number | string;
};

export type DeliveryStatus = 'Assigned' | 'Picked' | 'On the Way' | 'Delivered';

export type Delivery = {
  id?: number | string;
  order_id?: number | string;
  delivery_agent_id?: number | null;
  status?: DeliveryStatus;
  assigned_at?: string | null;
  updated_at?: string | null;
};

export type Payment = {
  id?: number | string;
  order_id?: number | string;
  amount?: number | string;
  mode?: string | null;
  paid_at?: string | null;
  invoice_text?: string | null;
};

// --- Convenience API response shapes ---
export type RestaurantsResponse = { restaurants: Restaurant[] };
export type RestaurantResponse = { restaurant: Restaurant };
export type MenuResponse = { items: MenuItem[] };
export type AuthResponse = { token?: string; user?: User };

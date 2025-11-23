import type { CartItem, ClientOrderItem } from './types'

export function loadCart(): CartItem[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch (e) {
    console.error('loadCart: failed to parse localStorage.cart', e)
    return []
  }
}

export function saveCart(next: CartItem[]) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(next))
      try { window.dispatchEvent(new Event('cartChange')) } catch {}
    }
  } catch (e) {
    console.error('saveCart: failed to write localStorage.cart', e)
  }
}

export function mergeAddItem(cart: CartItem[], item: Partial<CartItem> & { menu_item_id: string | number; quantity?: number }): CartItem[] {
  const next = cart.map(c => ({...c}))
  const idx = next.findIndex(c => String(c.menu_item_id) === String(item.menu_item_id))
  const qty = (item.quantity ?? 1)
  if (idx >= 0) {
    next[idx].quantity = (next[idx].quantity || 0) + qty
  } else {
    next.push({
      menu_item_id: item.menu_item_id,
      restaurant_id: item.restaurant_id,
      name: item.name,
      unit_price: item.unit_price,
      quantity: qty,
    } as CartItem)
  }
  return next
}

export function clearCart() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
      try { window.dispatchEvent(new Event('cartChange')) } catch {}
    }
  } catch (e) {
    console.error('clearCart: failed to remove cart', e)
  }
}

export function getCartSubtotal(cart?: CartItem[]) {
  const c = cart ?? loadCart()
  return c.reduce((s, it) => s + (Number(it.unit_price || 0) * (it.quantity || 0)), 0)
}

export function toClientOrderItems(cart?: CartItem[]): ClientOrderItem[] {
  const c = cart ?? loadCart()
  return c.map(i => ({
    menu_item_id: i.menu_item_id,
    name: i.name,
    unit_price: Number(i.unit_price || 0),
    quantity: i.quantity || 0,
  }))
}

export function subscribeCart(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => cb()
  window.addEventListener('cartChange', handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('cartChange', handler)
    window.removeEventListener('storage', handler)
  }
}

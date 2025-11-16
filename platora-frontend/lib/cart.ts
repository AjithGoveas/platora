import type { CartItem } from './types'

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


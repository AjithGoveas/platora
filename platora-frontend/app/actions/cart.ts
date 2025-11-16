// Server Action to add an item to a server-side cart; accepts id or full item payload and optional currentCart to merge
'use server'

import type { CartItem } from '@/lib/types'

type AddPayload =
  | string
  | number
  | ({ menu_item_id: string | number; name?: string; unit_price?: number | string; restaurant_id?: string | number; currentCart?: CartItem[] })

export async function addToCartAction(payload: AddPayload) {
  try {
    // Server-side debug log so you can see the action was invoked in the Next.js server logs
    // (check your frontend terminal running `npm run dev`)
    console.debug('[addToCartAction] called with payload:', payload);
    // Parse incoming payload
    let menuItemId: string | number
    let name: string | undefined
    let unit_price: number | string | undefined
    let restaurant_id: string | number | undefined
    let incomingCart: CartItem[] | undefined

    if (typeof payload === 'object' && payload !== null && 'menu_item_id' in payload) {
      menuItemId = (payload as any).menu_item_id
      name = (payload as any).name
      unit_price = (payload as any).unit_price
      restaurant_id = (payload as any).restaurant_id
      incomingCart = (payload as any).currentCart as CartItem[] | undefined
    } else {
      menuItemId = payload as string | number
    }

    // Start from incomingCart if provided, otherwise empty
    const cart: CartItem[] = Array.isArray(incomingCart) ? [...incomingCart] : []

    // Merge/increment existing
    const idx = cart.findIndex((c) => String(c.menu_item_id) === String(menuItemId))
    if (idx >= 0) {
      cart[idx].quantity = (cart[idx].quantity || 0) + 1
    } else {
      cart.push({ menu_item_id: menuItemId, name: name ?? undefined, unit_price: unit_price ?? undefined, restaurant_id: restaurant_id ?? undefined, quantity: 1 })
    }

    // Return the updated cart so the client component can persist it to localStorage
    return { success: true, cart }
  } catch (err) {
    console.error('addToCartAction failed', err)
    return { success: false }
  }
}

// Use central cart helpers for loading/saving/merging
'use client';
import React, {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {toast} from 'sonner';
import type {MenuItem, CartItem} from '@/lib/types';
import {formatPrice} from "@/lib/utils";
import { loadCart, saveCart, mergeAddItem } from '@/lib/cart'

type ActionResult = { success?: boolean; cart?: CartItem[] } | void;

type AddPayload = { menu_item_id: string | number; name?: string; unit_price?: number | string; restaurant_id?: string | number; currentCart?: CartItem[] };

type Props = {
  item: MenuItem;
  restaurantId?: string | number;
  // Optional server action passed from a server component. Name must end with Action.
  // Accept the full payload object (menu_item_id + metadata + optional currentCart) and return ActionResult.
  onAddAction?: (payload: AddPayload) => Promise<ActionResult> | undefined;
};

export default function MenuItemCard({item, restaurantId, onAddAction}: Props) {
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState<number>(0);

  useEffect(() => {
    try {
      const cart = loadCart();
      const found = cart.find((c) => String(c.menu_item_id) === String(item.id));
      if (found) setQty(found.quantity || 0);
    } catch (e) {
      // ignore invalid cart
      console.error('evaluating cart', e);
    }
  }, [item.id]);

  const addToCart = async () => {
    if (!item.is_available) {
      toast.error('Item is currently unavailable');
      return;
    }
    setAdding(true);
    try {
      // If a server action was provided, call it.
      if (onAddAction) {
        try {
          const clientCurrentCart = loadCart();
          const payload: AddPayload = { menu_item_id: item.id, name: item.name, unit_price: item.price, restaurant_id: restaurantId ?? item.restaurant_id, currentCart: clientCurrentCart };
          const res = await onAddAction(payload);

          // Type guard: does the action result include a cart array?
          const hasCart = (r: ActionResult): r is { cart: CartItem[] } => {
            return typeof r === 'object' && r !== null && 'cart' in r && Array.isArray((r as {cart?: unknown}).cart);
          };

          // Compute authoritative newCart: prefer server-returned cart, else merge locally
          let newCart: CartItem[];
          if (hasCart(res)) {
            newCart = res.cart;
          } else {
            newCart = mergeAddItem(clientCurrentCart, { menu_item_id: item.id, name: item.name, unit_price: item.price, restaurant_id: restaurantId ?? item.restaurant_id, quantity: 1 });
          }

          // Persist and update UI
          saveCart(newCart);
          const found = newCart.find((c) => String(c.menu_item_id) === String(item.id));
          if (found) setQty(found.quantity || 0);
          toast.success('Added to cart');
          return;
        } catch (err) {
          console.error('Server action failed', err);
          toast.error('Could not add to cart');
          return;
        }
      }

      // Client fallback: use localStorage cart via helpers
      const current = loadCart();
      const next = mergeAddItem(current, { menu_item_id: item.id, restaurant_id: restaurantId ?? item.restaurant_id, name: item.name, unit_price: item.price, quantity: 1 });
      saveCart(next);
      const foundLocal = next.find((c) => String(c.menu_item_id) === String(item.id));
      if (foundLocal) setQty(foundLocal.quantity || 0);
      toast.success('Added to cart');
    } catch (err) {
      console.error('Failed to add to cart', err);
      toast.error('Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="flex">
        <div className="w-1/3 bg-slate-50 flex items-center justify-center p-3">
          <div className="h-20 w-full rounded-md bg-gradient-to-br from-rose-200 to-pink-200 flex items-center justify-center text-rose-700 font-semibold">Img</div>
        </div>
        <CardContent className="p-4 w-2/3">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium text-base">{item.name}</div>
              {item.description && <div className="text-xs text-muted-foreground mt-1">{item.description}</div>}
            </div>
            <div className="text-right ml-3">
              <div className="font-semibold text-sm">{formatPrice(item.price)}</div>
              {!item.is_available && <div className="text-xs text-rose-600">Unavailable</div>}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">{item.is_available ? 'Available' : 'Currently unavailable'}</div>
            <div className="flex items-center gap-2">
              <Button size="sm" disabled={!item.is_available || adding} onClick={addToCart}>
                {adding ? 'Adding...' : 'Add'}
              </Button>
              <div className="text-sm text-muted-foreground">{qty > 0 ? `${qty} in cart` : ''}</div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

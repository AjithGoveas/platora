// Use central cart helpers for loading/saving/merging
'use client';
import React, {useEffect, useState, useTransition} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {toast} from 'sonner';
import type {CartItem, MenuItem} from '@/types';
import {formatPrice} from "@/lib/utils";
import {loadCart, mergeAddItem, saveCart} from '@/lib/cart'
import {Loader2, ShoppingCart} from 'lucide-react'

type ActionResult = { success?: boolean; cart?: CartItem[] } | void;

type AddPayload = {
    menu_item_id: string | number;
    name?: string;
    unit_price?: number | string;
    restaurant_id?: string | number;
    currentCart?: CartItem[]
};

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
    const [isPending, startTransition] = useTransition();

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

        // prevent double clicks while pending
        if (adding || isPending) return;

        setAdding(true);

        try {
            // If a server action was provided, call it.
            if (onAddAction) {
                try {
                    const clientCurrentCart = loadCart();
                    const payload: AddPayload = {
                        menu_item_id: item.id,
                        name: item.name,
                        unit_price: item.price,
                        restaurant_id: restaurantId ?? item.restaurant_id,
                        currentCart: clientCurrentCart
                    };

                    // use startTransition to keep UI responsive if available
                    startTransition(() => {
                        // call but don't await here to let React handle pending state visually
                    });

                    const res = await onAddAction(payload);

                    const hasCart = (r: ActionResult): r is { cart: CartItem[] } => {
                        return typeof r === 'object' && r !== null && 'cart' in r && Array.isArray((r as {
                            cart?: unknown
                        }).cart);
                    };

                    let newCart: CartItem[];
                    if (hasCart(res)) {
                        newCart = res.cart;
                    } else {
                        newCart = mergeAddItem(clientCurrentCart, {
                            menu_item_id: item.id,
                            name: item.name,
                            unit_price: item.price,
                            restaurant_id: restaurantId ?? item.restaurant_id,
                            quantity: 1
                        });
                    }

                    saveCart(newCart);
                    const found = newCart.find((c) => String(c.menu_item_id) === String(item.id));
                    if (found) setQty(found.quantity || 0);
                    toast.success('Added to cart');
                    return;
                } catch (err) {
                    console.error('Server action failed', err);
                    // fallthrough to client fallback
                }
            }

            // Client fallback: use localStorage cart via helpers
            const current = loadCart();
            const next = mergeAddItem(current, {
                menu_item_id: item.id,
                restaurant_id: restaurantId ?? item.restaurant_id,
                name: item.name,
                unit_price: item.price,
                quantity: 1
            });
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
            <CardHeader className="flex items-start gap-4">
                <div
                    className="w-20 h-20 shrink-0 rounded-md bg-slate-50 flex items-center justify-center overflow-hidden">
                    {/* simple image placeholder - swap with next/image if available */}
                    <span className="text-rose-700 font-semibold">Img</span>
                </div>
                <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-start justify-between gap-4">
                        <div className="truncate font-medium py-1">{item.name}</div>
                        <span
                            className="text-xs text-muted-foreground py-1">{item.is_available ? 'Available' : 'Currently unavailable'}</span>
                    </CardTitle>
                    {item.description &&
                        <CardDescription className="mt-1 line-clamp-2">{item.description}</CardDescription>}
                </div>
            </CardHeader>

            <CardContent className="pt-2">
                <div className="flex items-center justify-between">
                    <div className="ml-2 text-lg font-bold">{formatPrice(item.price)}</div>
                    <div className="flex items-center gap-2">
                        {qty > 0 &&
                            <div className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">{qty} in
                                cart</div>}
                        <Button
                            size="sm"
                            onClick={addToCart}
                            disabled={!item.is_available || adding || isPending}
                            aria-label={`Add ${item.name} to cart`}
                            className="flex items-center gap-2"
                        >
                            {(adding || isPending) ? <Loader2 className="size-4 animate-spin"/> :
                                <ShoppingCart className="size-4"/>}
                            {adding || isPending ? 'Adding...' : 'Add'}
                        </Button>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                {/* reserved for future actions / nutrition / tags */}
            </CardFooter>
        </Card>
    );
}

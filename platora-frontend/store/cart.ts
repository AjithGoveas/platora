import { create } from 'zustand';
import type { CartItem } from '@/types/cart';

type CartState = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addItem: (item) =>
        set((state) => {
            const existing = state.items.find(
                (i) => i.item.id === item.item.id && i.restaurantId === item.restaurantId
            );
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.item.id === item.item.id
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    ),
                };
            }
            return { items: [...state.items, item] };
        }),
    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.item.id !== id),
        })),
    clearCart: () => set({ items: [] }),
    updateQuantity: (id: string, quantity: number) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.item.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
            ),
        })),
}));

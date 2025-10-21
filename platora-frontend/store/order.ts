import { create } from 'zustand';
import type { Order } from '@/types/orders';
import { OrderStatus } from '@/types/orders';

type OrderState = {
    orders: Order[];
    setOrders: (data: Order[]) => void;
    updateStatus: (id: string, status: OrderStatus) => void;
};

export const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    setOrders: (data) => set({ orders: data }),
    updateStatus: (id, status) =>
        set((state) => ({
            orders: state.orders.map((order) =>
                order.id === id ? { ...order, status } : order
            ),
        })),
}));
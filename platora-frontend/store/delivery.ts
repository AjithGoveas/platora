import {create} from 'zustand';
import type {DeliveryOrder} from '@/types/delivery';
import {DeliveryStatus} from '@/types/delivery';

type DeliveryState = {
    orders: DeliveryOrder[];
    setOrders: (data: DeliveryOrder[]) => void;
    updateStatus: (id: string, status: DeliveryStatus) => void;
};

export const useDeliveryStore = create<DeliveryState>((set) => ({
    orders: [],
    setOrders: (data) => set({orders: data}),
    updateStatus: (id, status) =>
        set((state) => ({
            orders: state.orders.map((order) =>
                order.id === id ? {...order, status} : order
            ),
        })),
}));

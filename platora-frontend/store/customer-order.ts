import { create } from 'zustand';
import type { CustomerOrder } from '@/types/orders';

type CustomerOrderState = {
    orders: CustomerOrder[];
    setOrders: (data: CustomerOrder[]) => void;
};

export const useCustomerOrderStore = create<CustomerOrderState>((set) => ({
    orders: [],
    setOrders: (data) => set({ orders: data }),
}));

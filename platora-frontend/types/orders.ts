// types/orders

import {CartItem} from "@/types/cart";

// Restaurant-side order structure
export type Order = {
    id: string;
    customer: string;
    items: CartItem[];
    status: OrderStatus;
    total: number;
};

export enum OrderStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    PREPARING = 'preparing',
    READY = 'ready',
    DELIVERED = 'delivered',
    REJECTED = 'rejected',
    CANCELLED_BY_USER = 'cancelled_by_user'
}

// Customer order structure
export type CustomerOrder = {
    id: string;
    restaurant: string;
    items: CartItem[];
    status: OrderStatus;
    eta: string;
};

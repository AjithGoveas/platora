// Delivery order structure
export type DeliveryOrder = {
    id: string;
    restaurant: string;
    customer: string;
    address: string;
    items: string[]; // You can replace with MenuItem[] if needed
    status: DeliveryStatus;
    eta: string;
};

export enum DeliveryStatus {
    ASSIGNED = 'assigned',
    PICKED = 'picked',
    DELIVERED = 'delivered',
}
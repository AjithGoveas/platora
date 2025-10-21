// Menu item used across restaurant, cart, and orders
export type MenuItem = {
    id: string;
    name: string;
    price: number;
    available: boolean;
    image: string;
};
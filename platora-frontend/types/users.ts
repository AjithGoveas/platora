export type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
};

export enum Role {
    admin = 'admin',
    customer = 'customer',
    restaurant = 'restaurant',
    delivery = 'delivery',
}
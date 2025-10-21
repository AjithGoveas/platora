// Cart item structure
import {MenuItem} from "@/types/menu";

export type CartItem = {
    restaurantId: string;
    item: MenuItem;
    quantity: number;
};
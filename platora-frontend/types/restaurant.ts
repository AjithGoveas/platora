// Restaurant entity
import {MenuItem} from "@/types/menu";

export type Restaurant = {
    id: string;
    name: string;
    cuisine: string;
    image: string;
    menu: MenuItem[];
};
export interface CartItem {
  menu_item_id: string | number;
  name?: string;
  unit_price?: number | string;
  restaurant_id?: string | number;
  quantity: number;
}


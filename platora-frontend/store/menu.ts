// store/menu.ts
import { create } from 'zustand';
import type { MenuItem } from '@/types/menu';

type MenuState = {
    items: MenuItem[];
    setItems: (data: MenuItem[]) => void;
    toggleAvailability: (id: string) => void;
};

export const useMenuStore = create<MenuState>((set) => ({
    items: [],
    setItems: (data) => set({ items: data }),
    toggleAvailability: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, available: !item.available } : item
            ),
        })),
}));

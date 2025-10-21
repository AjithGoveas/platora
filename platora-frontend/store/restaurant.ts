import { create } from 'zustand';
import type { Restaurant } from '@/types/restaurant';

type RestaurantState = {
    restaurants: Restaurant[];
    setRestaurants: (data: Restaurant[]) => void;
};

export const useRestaurantStore = create<RestaurantState>((set) => ({
    restaurants: [],
    setRestaurants: (data) => set({ restaurants: data }),
}));

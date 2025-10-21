import { create } from 'zustand';
import { User, logout } from '@/lib/auth';
import {toast} from "sonner";

type UserState = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => {
        set({user});
        toast.success("Account logged in successfully 🎉");
    },
    logout: () => {
        logout()
            .then(() => toast.success("Account logged out 🎉"))
            .catch(r => console.error(r));
        set({ user: null });
    },
}));

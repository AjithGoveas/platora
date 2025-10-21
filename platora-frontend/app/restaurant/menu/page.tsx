// app/restaurant/menu/page.tsx
'use client';

import { useEffect } from 'react';
import { useMenuStore } from '@/store/menu';
import { menuItems } from '@/lib/dummy-data';
import { Button } from '@/components/ui/button';
import MenuItemCard from '@/components/restaurant/menu-item-card';
import {toast} from "sonner";

export default function MenuPage() {
    const { items, setItems, toggleAvailability } = useMenuStore();

    useEffect(() => {
        setItems(menuItems);
    }, [setItems]);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Manage Menu</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <MenuItemCard key={item.id} item={item}>
                        <Button
                            variant="outline"
                            onClick={() => {
                                toggleAvailability(item.id);
                                toast.success(`${item.name} availability updated`);
                            }}
                        >
                            {item.available ? 'Mark Unavailable' : 'Mark Available'}
                        </Button>
                    </MenuItemCard>
                ))}
            </div>
        </div>
    );
}

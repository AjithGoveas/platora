'use client';

import { useParams } from 'next/navigation';
import { restaurants } from '@/lib/dummy-data';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function RestaurantMenuPage() {
    const { id } = useParams();
    const restaurant = restaurants.find((r) => r.id === id);
    const { addItem } = useCartStore();

    if (!restaurant) return <p className="p-6">Restaurant not found.</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
            <p className="text-muted-foreground">{restaurant.cuisine}</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {restaurant.menu.map((item) => (
                    <Card key={item.id} className="p-4 flex items-center gap-4 hover:shadow-lg transition-shadow duration-300">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                                src={item.image || '/placeholder.svg'}
                                alt={item.name}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h2 className="font-semibold text-lg">{item.name}</h2>
                            <p className="text-sm text-muted-foreground">₹{item.price}</p>
                        </div>
                        <Button size="sm" onClick={() => addItem({ restaurantId: restaurant.id, item: item, quantity: 1 })}>
                            Add
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
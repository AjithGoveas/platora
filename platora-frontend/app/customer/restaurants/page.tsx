'use client';

import { restaurants } from '@/lib/dummy-data';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function RestaurantsPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Browse Restaurants</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {restaurants.map((res) => (
                    <Link key={res.id} href={`/customer/restaurant/${res.id}`}>
                        <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative w-full h-40">
                                <Image
                                    src={res.image || '/placeholder.svg'}
                                    alt={res.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="p-4 space-y-1">
                                <h2 className="text-lg font-bold">{res.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{res.cuisine}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
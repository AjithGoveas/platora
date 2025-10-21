'use client';

import { restaurants } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ManageRestaurantsPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Manage Restaurants</h1>

            <div className="grid gap-4 sm:grid-cols-2">
                {restaurants.map((r) => (
                    <Card key={r.id} className="p-4 space-y-2">
                        <h2 className="font-semibold">{r.name}</h2>
                        <p className="text-sm text-muted-foreground">{r.cuisine}</p>
                        <Button size="sm" variant="outline">Edit</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}

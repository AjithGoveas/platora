import RestaurantCard from '@/components/RestaurantCard';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {fetchRestaurants} from '@/lib/api';
import type {Restaurant} from '@/types/menu';
import Link from 'next/link';

export default async function RestaurantsList() {
    let restaurants: Restaurant[] = [];
    let error: string | null = null;
    try {
        restaurants = await fetchRestaurants();
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err || '');
        error = msg || 'Failed to load restaurants';
    }

    return (
        <main className="min-h-screen mt-16 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight">Discover Restaurants</h1>
                <p className="text-muted-foreground mt-2">Browse restaurants and view their menus.</p>
            </header>

            {error && <div className="mb-6 text-sm text-rose-600">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.length === 0 ? (
                    <Card className="p-6">
                        <CardHeader>
                            <CardTitle>No restaurants found</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">We could not find any restaurants right now.</p>
                            <div className="mt-4">
                                <Link href="/" className="inline-block">
                                    <Button>Back to home</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    restaurants.map((r) => (
                        <RestaurantCard key={r.id} id={r.id} name={r.name} cuisine={r.address || 'Local'}/>
                    ))
                )}
            </div>
        </main>
    );
}

import RestaurantCard from '@/components/RestaurantCard';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {Separator} from '@/components/ui/separator';
import {fetchRestaurants} from '@/lib/api';
import type {Restaurant} from '@/types/menu';
import Link from 'next/link';

export default async function CustomerDashboard() {
    // fetch a couple of things server-side for fast first paint
    let restaurants: Restaurant[];
    try {
        restaurants = await fetchRestaurants();
    } catch {
        restaurants = [];
    }

    const restaurantsCount = restaurants.length;
    const preview = restaurants.slice(0, 3);

    return (
        <div className="min-h-screen mt-16 p-8">
            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome Back, Customer!</h1>
                <p className="text-muted-foreground mt-2">
                    Your personalized space to manage orders, explore restaurants, and track your progress.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>My Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">View and manage your past and current orders.</p>
                        <div className="mt-4">
                            <Link href="/customer/orders">
                                <Button>View Orders</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Restaurants</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{restaurantsCount} restaurants available</p>
                        <div className="mt-4">
                            <Link href="/customer/restaurants">
                                <Button>Explore</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>My Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Update your personal information and preferences.
                        </p>
                        <div className="mt-4">
                            <Link href="/auth/profile">
                                <Button>Edit Profile</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Restaurants Catalog Progress</p>
                                <Progress value={Math.min(100, restaurantsCount)} className="mt-2"/>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {restaurantsCount} restaurants indexed
                                </p>
                            </div>
                            <Separator/>
                            <div>
                                <p className="text-sm text-muted-foreground">Top Picks</p>
                                <div className="mt-3 space-y-3">
                                    {preview.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No restaurants to preview</p>
                                    ) : (
                                        preview.map((r) => (
                                            <div key={r.id}>
                                                <RestaurantCard
                                                    id={r.id}
                                                    name={r.name}
                                                    cuisine={r.address || 'Local'}
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

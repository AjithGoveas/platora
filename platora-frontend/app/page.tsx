import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import RestaurantsExplorer from '@/components/RestaurantsExplorer';
import {fetchRestaurants} from '@/lib/api';
import type {Restaurant} from '@/types/menu';

export default async function Home() {
    const restaurants: Restaurant[] = await fetchRestaurants().catch(() => []);

    return (
        <main className="min-h-screen mt-8">
            <div className="pt-8 pb-16">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    {/* Hero */}
                    <section className="grid gap-8 lg:grid-cols-2 items-center">
                        <div>
                            <div className="inline-flex items-center gap-3 mb-4">
                                <div
                                    className="h-12 w-12 rounded-lg bg-gradient-to-br from-rose-500 via-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow">P
                                </div>
                                <span
                                    className="text-sm font-medium text-muted-foreground">Platora • Order food online</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Restaurants near you
                                — <span className="text-rose-600">delivered hot & fast</span></h1>

                            <p className="mt-4 text-lg text-muted-foreground max-w-xl">Browse top-rated restaurants,
                                discover daily deals, and track orders in real time. Fast delivery and curated menus
                                from trusted local spots.</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href="/customer/dashboard">
                                    <Button size="lg" className="bg-rose-600 hover:bg-rose-500">🍔 Order now</Button>
                                </Link>
                                <Link href="/restaurant/dashboard">
                                    <Button size="lg" variant="outline">Partner with Platora</Button>
                                </Link>
                                <Link href="/auth/login">
                                    <Button size="lg" variant="link">Login / Signup</Button>
                                </Link>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-4 max-w-sm text-sm text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-8 w-8 rounded bg-rose-100 flex items-center justify-center font-semibold text-rose-600">30+
                                    </div>
                                    <div> Cities</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-8 w-8 rounded bg-rose-100 flex items-center justify-center font-semibold text-rose-600">500+
                                    </div>
                                    <div> Restaurants</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-8 w-8 rounded bg-rose-100 flex items-center justify-center font-semibold text-rose-600">99%
                                    </div>
                                    <div>On-time</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Quick feature card */}
                        <aside>
                            <Card className="p-6 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Why choose Platora?</CardTitle>
                                    <CardDescription>Fast delivery, curated restaurants, and live
                                        tracking.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-3 mt-2">
                                    <ul className="grid gap-3">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-rose-600"/>
                                            <div>
                                                <div className="font-medium">Hot & fresh deliveries</div>
                                                <div className="text-sm text-muted-foreground">We prioritize speed
                                                    without compromising food quality.
                                                </div>
                                            </div>
                                        </li>

                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-rose-600"/>
                                            <div>
                                                <div className="font-medium">Exclusive offers</div>
                                                <div className="text-sm text-muted-foreground">Get discounts from
                                                    partnered restaurants.
                                                </div>
                                            </div>
                                        </li>

                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-rose-600"/>
                                            <div>
                                                <div className="font-medium">Live order tracking</div>
                                                <div className="text-sm text-muted-foreground">See your delivery move in
                                                    real time.
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="mt-4">
                                        <Link href="/customer/dashboard">
                                            <Button size="sm">Start ordering</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>
                    </section>

                    {/* Restaurants explorer */}
                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Explore restaurants</h2>
                        <RestaurantsExplorer restaurants={restaurants}/>
                    </section>

                    {/* Quick links */}
                    <section className="mt-12 mb-16">
                        <h3 className="text-lg font-semibold mb-4">Quick links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {href: '/customer/dashboard', label: 'Customer Dashboard'},
                                {href: '/restaurant/dashboard', label: 'Restaurant Dashboard'},
                                {href: '/delivery/dashboard', label: 'Delivery Dashboard'},
                            ].map((link) => (
                                <Link key={link.href} href={link.href}
                                      className="block rounded-lg border p-6 text-center font-medium shadow-sm hover:shadow-md hover:border-rose-500 hover:text-rose-500 transition">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

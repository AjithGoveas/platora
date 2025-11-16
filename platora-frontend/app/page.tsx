import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RestaurantCard from '@/components/RestaurantCard';
import { fetchRestaurants } from '@/lib/api';
import type { Restaurant } from '@/lib/types';

export default async function Home() {
  const restaurants: Restaurant[] = await fetchRestaurants().catch(() => []);

  return (
    <div className="mt-20 px-4 md:px-8">
      {/* Hero Section */}
      <section className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <div className="inline-flex items-center gap-3 mb-6">
            <div
              className="h-12 w-12 rounded-lg bg-gradient-to-br from-rose-500 via-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
              P
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Platora • Order food online
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Restaurants near you, <span className="text-rose-600">delivered hot & fast</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            Browse top restaurants, get exclusive offers, and track orders in real time —
            Platora brings the best local food to your door.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/customer/dashboard">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-500">
                🍔 Order now
              </Button>
            </Link>
            <Link href="/restaurant/dashboard">
              <Button size="lg" variant="outline">
                Partner with Platora
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="link">
                Login / Signup
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { value: '30+', label: 'Cities' },
              { value: '500+', label: 'Restaurants' },
              { value: '99%', label: 'On-time delivery' },
            ].map((stat) => (
              <Card key={stat.label} className="text-center shadow-sm">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Platora */}
        <div>
          <Card className="p-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Why choose Platora?</CardTitle>
              <CardDescription>
                Fast delivery, curated restaurants, and live tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Hot & fresh deliveries',
                  'Exclusive restaurant offers',
                  'Real-time order tracking',
                  'Easy menu & order management',
                ].map((feature) => (
                  <Card key={feature} className="p-3 text-sm shadow-sm hover:shadow-md transition">
                    {feature}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Restaurants (live) */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Featured restaurants</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.length === 0 && (
                <div className="text-sm text-muted-foreground">No restaurants available yet.</div>
              )}

              {restaurants.slice(0, 9).map((r: Restaurant) => (
                <RestaurantCard
                  key={r.id}
                  id={String(r.id)}
                  name={r.name}
                  cuisine={r.address || 'Various'}
                  minOrder={'\u20b9150'}
                  deliveryTime={'30-40 min'}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Quick links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { href: '/customer/dashboard', label: 'Customer Dashboard' },
            { href: '/restaurant/dashboard', label: 'Restaurant Dashboard' },
            { href: '/delivery/dashboard', label: 'Delivery Dashboard' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg border p-6 text-center font-medium shadow-sm hover:shadow-md hover:border-rose-500 hover:text-rose-500 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

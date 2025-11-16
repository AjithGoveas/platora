// Rewritten restaurant page with improved layout, error handling and client menu cards
import React from 'react';
import Link from 'next/link';
import {Card, CardContent} from '@/components/ui/card';
import MenuItemCard from '@/components/restaurant/MenuItemCard';
import RestaurantContactActions from '@/components/restaurant/RestaurantContactActions';
import {fetchMenuByRestaurant, fetchRestaurantById} from '@/lib/api';
import type {MenuItem, Restaurant} from '@/lib/types';
import {MapPin, Phone, Star, ArrowLeft} from 'lucide-react';
import {Button} from "@/components/ui/button";
import * as cartActions from '@/app/actions/cart';

type Props = {
  params: { id: string | number } | Promise<{ id: string | number }>;
};

function formatDateSafe(value: string | undefined | null) {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat(undefined, {year: 'numeric', month: 'short', day: 'numeric'}).format(d);
  } catch {
    return '—';
  }
}

export default async function RestaurantPage({params}: Props) {
  // Await params directly (covers both Promise and plain object)
  const {id: rawId} = await params;
  const id = String(rawId ?? '').trim();

  if (!id) {
    return (
      <main className="mt-24 px-4 md:px-8">
        <div className="text-center text-sm text-rose-600">Invalid restaurant id.</div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-rose-500 underline">Back to home</Link>
        </div>
      </main>
    );
  }

  // Fetch restaurant and menu in parallel and handle failures gracefully
  let restaurant: Restaurant | null = null;
  let menu: MenuItem[] = [];
  try {
    const [r, m] = await Promise.all([
      fetchRestaurantById(id).catch(() => null),
      fetchMenuByRestaurant(id).catch(() => []),
    ]);
    restaurant = r;
    menu = m || [];
  } catch (err) {
    console.error('Failed to load restaurant data', err);
    return (
      <main className="mt-24 px-4 md:px-8">
        <div className="text-center text-sm text-rose-600">Failed to load restaurant. Please try again later.</div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-rose-500 underline">Back to home</Link>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="mt-24 px-4 md:px-8">
        <div className="text-center text-sm text-muted-foreground">Restaurant not found.</div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-rose-500 underline">Back to home</Link>
        </div>
      </main>
    );
  }

  // Sort menu: available first, then by name
  const available = menu.filter(i => i.is_available !== false).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  const unavailable = menu.filter(i => i.is_available === false).sort((a,b)=>String(a.name).localeCompare(String(b.name)));

  return (
    <main className="mt-24 px-4 md:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <ol className="flex items-center gap-2 text-muted-foreground">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/" className="hover:underline">Restaurants</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium">{restaurant.name}</li>
        </ol>
      </nav>

      <header className="mb-8 grid gap-6 md:grid-cols-3 md:items-center">
        <div className="flex items-center gap-4 md:col-span-2">
          <div
            className="h-28 w-28 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-4xl">
            <span aria-hidden>{String(restaurant.name || 'R').charAt(0)}</span>
            <span className="sr-only">{restaurant.name}</span>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold leading-tight">{restaurant.name}</h1>
              <span className="text-sm text-muted-foreground">{restaurant.is_active ? 'Open' : 'Closed'}</span>
            </div>

            <div className="mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" aria-hidden/> <span>{restaurant.address || 'Address not provided'}</span></span>
              {restaurant.phone && <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4" aria-hidden/> <a href={`tel:${restaurant.phone}`} className="hover:underline">{restaurant.phone}</a></span>}
            </div>

            <div className="mt-2 text-sm text-muted-foreground">Owner: {restaurant.owner_name || restaurant.owner_email || '—'}</div>
            <div className="mt-3 flex gap-2 items-center">
              <span className={"px-2 py-1 rounded-full text-xs font-medium " + (restaurant.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600')}>{restaurant.is_active ? 'Open' : 'Closed'}</span>
              <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 inline-flex items-center gap-1"><Star className="h-4 w-4" aria-hidden/> <span className="sr-only">Rating</span>4.5</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 md:justify-end">
          <Link href="/" aria-label="Back to restaurants" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline">
            <ArrowLeft className="h-4 w-4"/> Back
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Menu</h2>
            <div className="text-sm text-muted-foreground">{menu.length} item{menu.length !== 1 ? 's' : ''}</div>
          </div>

          {available.length === 0 && unavailable.length === 0 && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">No menu items available.</div>
              <div className="flex gap-2">
                {/* interactive handlers (toast) live in a client component */}
                <RestaurantContactActions phone={restaurant.phone} />
              </div>
            </div>
          )}

          {available.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {available.map((item) => (
                <MenuItemCard key={String(item.id)} item={item} restaurantId={restaurant.id} onAddAction={cartActions.addToCartAction} />
              ))}
            </div>
          )}

          {unavailable.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Currently unavailable</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-70">
                {unavailable.map((item) => (
                  <MenuItemCard key={String(item.id)} item={item} restaurantId={restaurant.id} onAddAction={cartActions.addToCartAction} />
                ))}
              </div>
            </div>
          )}
        </section>

        <aside>
          <Card className="p-4 sticky top-24">
            <CardContent>
              <div className="text-sm text-muted-foreground">Quick info</div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Estimated delivery</div>
                  <div className="font-semibold">30-40 min</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Min. order</div>
                  <div className="font-semibold">₹150</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Since</div>
                  <div className="font-semibold">
                    <time dateTime={restaurant.created_at ?? undefined}>{formatDateSafe(restaurant.created_at)}</time>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link href="/cart">
                  <Button className="w-full">View cart</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 text-xs text-muted-foreground">
            <div>Owner: {restaurant.owner_name || '—'}</div>
            <div className="mt-1">Contact: {restaurant.owner_email || '—'}</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

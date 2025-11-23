'use client'

import React, {useMemo, useState} from 'react'
import type {Restaurant} from '@/types/menu'
import RestaurantCard from './RestaurantCard'
import {Button} from '@/components/ui/button'

type Props = {
    restaurants: Restaurant[]
}

export default function RestaurantsExplorer({restaurants}: Props) {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('All')
    const [sort, setSort] = useState<'relevance' | 'rating' | 'newest'>('relevance')

    const categories = ['All', 'Pizza', 'Indian', 'Burgers', 'Sushi', 'Tacos', 'Dessert']

    const normalized = (s = '') => s.toString().toLowerCase()

    const filtered = useMemo(() => {
        let items = restaurants || []

        if (category !== 'All') {
            const cat = category.toLowerCase()
            items = items.filter(r => (
                normalized(r.name).includes(cat) ||
                normalized(r.address ?? '').includes(cat) ||
                normalized(r.name).includes(cat.replace(/s$/, ''))
            ))
        }

        if (query.trim()) {
            const q = query.trim().toLowerCase()
            items = items.filter(r =>
                normalized(r.name).includes(q) ||
                normalized(r.address ?? '').includes(q) ||
                (r.phone || '').includes(q)
            )
        }

        if (sort === 'rating') {
            // fake rating sort by name length for deterministic seed data
            items = items.slice().sort((a, b) => (b.name.length - a.name.length))
        } else if (sort === 'newest') {
            items = items.slice().reverse()
        }

        return items
    }, [restaurants, query, category, sort])

    return (
        <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                    <label htmlFor="search" className="sr-only">Search restaurants</label>
                    <div className="flex items-center gap-2 border rounded-md overflow-hidden shadow-sm">
                        <input
                            id="search"
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search restaurants, cuisine or address"
                            className="flex-1 px-4 py-3 outline-none text-sm"
                            aria-label="Search restaurants"
                        />
                        <Button size="sm" onClick={() => setQuery('')} variant="ghost">Clear</Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">{filtered.length} restaurants</div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex gap-2 flex-wrap">
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                aria-pressed={category === c}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${category === c ? 'bg-rose-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="sort" className="text-xs text-muted-foreground">Sort</label>
                        <select id="sort" value={sort}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as 'relevance' | 'rating' | 'newest')}
                                className="text-sm px-2 py-1 border rounded">
                            <option value="relevance">Relevance</option>
                            <option value="rating">Top rated</option>
                            <option value="newest">Newest</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.length === 0 ? (
                    // Empty state / skeletons for perceived performance
                    Array.from({length: 6}).map((_, i) => (
                        <div key={i} className="animate-pulse p-3 border rounded-md bg-white min-h-[100px]"></div>
                    ))
                ) : (
                    filtered.slice(0, 36).map(r => (
                        <RestaurantCard
                            key={r.id}
                            id={String(r.id)}
                            name={r.name}
                            cuisine={r.address || r.phone || 'Various'}
                            minOrder={'\u20b9150'}
                            deliveryTime={'30-40 min'}
                        />
                    ))
                )}
            </div>

            {filtered.length > 36 && (
                <div className="mt-6 text-center">
                    <Button size="sm">Show more</Button>
                </div>
            )}
        </div>
    )
}

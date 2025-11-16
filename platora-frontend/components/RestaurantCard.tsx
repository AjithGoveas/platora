// Add the client directive so event handlers can be passed to child client components
'use client'

import React from 'react'
import Link from 'next/link'
import {Card} from '@/components/ui/card'
import {Button} from '@/components/ui/button'

type Props = {
    id: string | number
    name: string
    cuisine: string
    minOrder?: string
    deliveryTime?: string
    rating?: number
}

export default function RestaurantCard({
                                           id,
                                           name,
                                           cuisine,
                                           minOrder = '₹150',
                                           deliveryTime = '30-40 min',
                                           rating = 4.4
                                       }: Props) {
    return (
        <Card className="p-0 overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row">
                <div
                    className="h-28 sm:h-24 sm:w-28 bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {name.charAt(0)}
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="font-medium text-sm">{name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{cuisine} • {minOrder} min order</div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-muted-foreground">{deliveryTime}</div>
                        <div className="flex items-center gap-2">
                            <div
                                className="px-2 py-1 rounded bg-amber-400 text-xs font-semibold">{rating.toFixed(1)}</div>
                            <div className="flex items-center gap-2">
                                <Link href={`/restaurant/${id}`}>
                                    <Button size="sm">View</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

'use client'

import React from 'react'

type Props = {
    count: number
    total: number
    onClickAction?: () => void
}

export default function CartFab({count, total, onClickAction}: Props) {
    return (
        <div className="fixed right-4 bottom-6 z-50">
            <button
                onClick={onClickAction}
                className="inline-flex items-center gap-3 bg-rose-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-rose-500 focus:outline-none"
                aria-label="Open cart"
            >
                <span className="font-semibold">Cart</span>
                <span className="bg-white text-rose-600 px-2 py-0.5 rounded text-sm font-medium">{count}</span>
                <span className="text-sm opacity-90">₹{total}</span>
            </button>
        </div>
    )
}


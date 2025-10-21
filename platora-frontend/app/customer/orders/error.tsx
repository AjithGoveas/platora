"use client";

export default function OrdersError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="p-6 text-center space-y-3">
            <h2 className="text-xl font-semibold">⚠️ Failed to load your orders</h2>
            <p className="text-muted-foreground">{error.message}</p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
            >
                Try Again
            </button>
        </div>
    );
}

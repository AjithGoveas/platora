"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <html>
        <body className="h-screen flex items-center justify-center bg-background">
        <div className="max-w-md text-center space-y-4">
            <h1 className="text-3xl font-bold">Something went wrong 😢</h1>
            <p className="text-muted-foreground">
                {error.message || "An unexpected error has occurred."}
            </p>
            <Button onClick={() => reset()}>Try Again</Button>
        </div>
        </body>
        </html>
    );
}

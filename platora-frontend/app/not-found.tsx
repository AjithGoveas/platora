import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center gap-4">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-muted-foreground text-lg">
                Oops! The page you’re looking for doesn’t exist.
            </p>
            <Button asChild>
                <Link href="/">Go Back Home</Link>
            </Button>
        </div>
    );
}
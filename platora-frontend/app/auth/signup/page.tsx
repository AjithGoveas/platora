"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {toast} from "sonner";

export default function SignupPage() {
    const [loading, setLoading] = useState(false);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 👉 connect to backend later
        setTimeout(() => {
            setLoading(false);
            toast.success("Account created (dummy) 🎉");
        }, 1000);
    };

    return (
        <section className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Join Platora and start ordering today.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" type="text" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="********" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>

                    <p className="mt-4 text-sm text-muted-foreground text-center">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="underline hover:text-primary">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {toast} from "sonner";

export default function ProfilePage() {
    // Dummy user data (later will come from backend/session)
    const [user, setUser] = useState({
        name: "John Doe",
        email: "john@example.com",
        role: "Customer",
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Profile updated (dummy) ✅");
    };

    return (
        <section className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Manage your account details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" type="text" defaultValue={user.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user.email} disabled />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" type="text" defaultValue={user.role} disabled />
                        </div>
                        <Button type="submit" className="w-full">
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
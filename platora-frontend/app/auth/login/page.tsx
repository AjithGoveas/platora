'use client';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {cn, getErrorMessage} from '@/lib/utils';
import {login as apiLogin, setToken as apiSetToken} from '@/lib/api';
import {toast} from "sonner";

const roles = ['Customer', 'Restaurant', 'Delivery', 'Admin'];

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    function validate() {
        if (!email.trim()) return 'Email is required';
        if (!password) return 'Password is required';
        // basic email format check
        const at = email.indexOf('@');
        if (at <= 0 || at === email.length - 1) return 'Invalid email address';
        return null;
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const v = validate();
        if (v) return setError(v);
        setLoading(true);
        try {
            const data = await apiLogin(email, password);
            if (data.token) {
                apiSetToken(data.token);
            }
            const userObj = data.user || null;
            try {
                localStorage.setItem('user', JSON.stringify(userObj));
                try { window.dispatchEvent(new Event('authChange')); } catch {}
            } catch {}

            const userRole = data.user?.role || role;
            toast.success("Logged in successfully!");
            if (userRole === 'restaurant') router.push('/restaurant/dashboard');
            else if (userRole === 'delivery') router.push('/delivery/dashboard');
            else if (userRole === 'admin') router.push('/admin/dashboard');
            else router.push('/customer/dashboard');
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md shadow-xl border-none rounded-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-rose-500">Platora</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Sign in to access your dashboard
                    </CardDescription>
                </CardHeader>
                <Separator/>
                <CardContent>
                    {error && (
                        <div className="mb-3 text-sm text-red-600" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="mb-2 block">Role</Label>
                            <div className="flex gap-2 flex-wrap">
                                {roles.map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        aria-pressed={role === r}
                                        className={cn(
                                            'px-3 py-1 rounded-full text-sm border transition-colors',
                                            role === r
                                                ? 'bg-rose-500 text-white border-rose-500'
                                                : 'bg-transparent hover:bg-rose-100'
                                        )}
                                        onClick={() => setRole(r)}
                                    >
                                        {r === 'Delivery' ? 'Delivery Agent' : r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button type="submit" className="w-full hover:bg-rose-500 bg-pink-500" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-sm text-center text-muted-foreground">
                    Don’t have an account?{' '}
                    <a href="/auth/signup" className="text-rose-500 hover:underline ml-1">
                        Sign up
                    </a>
                </CardFooter>
            </Card>
        </div>
    );
}

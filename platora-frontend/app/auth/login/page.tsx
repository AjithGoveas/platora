'use client';

import { login } from '@/lib/auth';
import { useUserStore } from '@/store/user';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function LoginPage() {
    const { setUser } = useUserStore();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const user = await login(email, password);
        setUser(user);

        switch (user.role) {
            case 'admin':
                router.push('/admin/dashboard');
                break;
            case 'restaurant':
                router.push('/restaurant/dashboard');
                break;
            case 'delivery':
                router.push('/delivery/dashboard');
                break;
            default:
                router.push('/customer/restaurants');
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto space-y-4 border">
            <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto space-y-4">
            <h1 className="text-2xl font-semibold">Login</h1>
            <Input placeholder="Email" required={true} value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" required={true} value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="w-full" type={"submit"} onSubmit={handleLogin}>Login</Button>
            </form>
        </div>
    );
}

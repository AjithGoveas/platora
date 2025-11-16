'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { setToken as apiSetToken, signup as apiSignup } from '@/lib/api';
import { cn, getErrorMessage } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const roles = ['Customer', 'Restaurant', 'Delivery', 'Admin'];

export default function SignupPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [role, setRole] = useState('customer');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	function validate() {
		if (!name.trim()) return 'Name is required';
		if (!email.trim()) return 'Email is required';
		if (!password) return 'Password is required';
		// simple phone check
		if (phone && phone.length < 7) return 'Phone looks too short';
		return null;
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		const v = validate();
		if (v) return setError(v);
		setLoading(true);
		try {
			const data = await apiSignup({ email, password, name, phone, role });
			if (data.token) apiSetToken(data.token);
			const userObj = data.user || { email, name, role };
			try {
				localStorage.setItem('user', JSON.stringify(userObj));
				try {
					window.dispatchEvent(new Event('authChange'));
				} catch {}
			} catch {}
			toast.success('Account created');
			if (role === 'restaurant') router.push('/restaurant/dashboard');
			else if (role === 'delivery') router.push('/delivery/dashboard');
			else if (role === 'admin') router.push('/admin/dashboard');
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
					<CardTitle className="text-2xl font-semibold text-rose-500">Platora — Sign up</CardTitle>
					<CardDescription className="text-sm text-muted-foreground">
						Create an account for your role
					</CardDescription>
				</CardHeader>
				<Separator />
				<CardContent>
					{error && (
						<div className="mb-3 text-sm text-red-600" role="alert">
							{error}
						</div>
					)}
					<form onSubmit={submit} className="space-y-3">
						<div>
							<Label className="block text-sm mb-1">Name</Label>
							<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
						</div>
						<div>
							<Label className="block text-sm mb-1">Email</Label>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
							/>
						</div>
						<div>
							<Label className="block text-sm mb-1">Password</Label>
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Choose a strong password"
							/>
						</div>
						<div>
							<Label className="block text-sm mb-1">Phone</Label>
							<Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
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
						<div>
							<Button className="w-full hover:bg-rose-500 bg-pink-500" type="submit" disabled={loading}>
								{loading ? 'Creating...' : 'Sign up'}
							</Button>
						</div>
					</form>
				</CardContent>
				<CardFooter className="text-sm text-center text-muted-foreground">
					Already have an account?{' '}
					<a className="text-rose-500 hover:underline ml-1" href="/auth/login">
						Login
					</a>
				</CardFooter>
			</Card>
		</div>
	);
}

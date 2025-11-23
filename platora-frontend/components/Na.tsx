'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { clearAuthStorage } from '@/lib/api';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type User = {
	name: string;
	role: string;
	avatarUrl?: string;
};

export default function Na() {
	const [open, setOpen] = useState(false);
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [user, setUser] = useState<User | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const router = useRouter();

	// Load user from localStorage (or replace with your auth provider)
	useEffect(() => {
		try {
			const raw = localStorage.getItem('user');
			if (raw) {
				// schedule setState to avoid synchronous setState-in-effect warnings
				setTimeout(() => setUser(JSON.parse(raw) as User), 0);
			}
		} catch {
			// ignore parse errors
		}
	}, []);

	// Listen for auth changes (custom event or cross-tab storage) so the navbar updates immediately
	useEffect(() => {
		const onAuth = () => {
			try {
				const raw = localStorage.getItem('user');
				// schedule setState to avoid synchronous updates inside event handlers
				setTimeout(() => {
					if (raw) setUser(JSON.parse(raw) as User);
					else setUser(null);
				}, 0);
			} catch {
				setTimeout(() => setUser(null), 0);
			}
		};
		window.addEventListener('authChange', onAuth);
		window.addEventListener('storage', onAuth);
		return () => {
			window.removeEventListener('authChange', onAuth);
			window.removeEventListener('storage', onAuth);
		};
	}, []);

	useEffect(() => {
		function onDoc(e: MouseEvent) {
			if (!menuRef.current) return;
			if (!(e.target instanceof Node)) return;
			if (!menuRef.current.contains(e.target)) setMenuOpen(false);
		}

		document.addEventListener('click', onDoc);
		return () => document.removeEventListener('click', onDoc);
	}, []);

	const handleLogout = () => {
		clearAuthStorage();
		setUser(null);
		setMenuOpen(false);
		// navigate client-side to home
		toast.success('Logged out successfully!');
		router.push('/');
	};

	// Note: we rely on `resolvedTheme` from next-themes directly to avoid hydration/state flip
	const activeTheme = resolvedTheme ?? theme;

	return (
		<header className="fixed w-full bg-white/70 dark:bg-black/40 backdrop-blur-md border-b shadow-sm z-50">
			<div className="page-max flex items-center justify-between py-3 px-4">
				{/* Logo + Nav */}
				<div className="flex items-center gap-6">
					<Link href="/" className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-lg bg-gradient-to-br from-rose-500 via-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
							P
						</div>
						<span className="font-semibold text-lg tracking-tight text-foreground">Platora</span>
					</Link>
					<nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
						{user?.role === 'customer' && (
							<>
								<Link href="/customer/dashboard" className="hover:text-rose-600 transition-colors">
									Customer Dashboard
								</Link>
								<Link href="/customer/orders" className="hover:text-rose-600 transition-colors">
									Customer Orders
								</Link>
								<Link href="/customer/restaurants" className="hover:text-rose-600 transition-colors">
									Restaurants List
								</Link>
							</>
						)}
						{user?.role === 'restaurant' && (
							<>
								<Link href="/restaurant/dashboard" className="hover:text-rose-600 transition-colors">
									Restaurant Dashboard
								</Link>
							</>
						)}
						{user?.role === 'delivery' && (
							<>
								<Link href="/delivery/dashboard" className="hover:text-rose-600 transition-colors">
									Delivery Dashboard
								</Link>
							</>
						)}
						{user?.role === 'admin' && (
							<>
								<Link href="/admin/dashboard" className="hover:text-rose-600 transition-colors">
									Admin Dashboard
								</Link>
							</>
						)}
					</nav>
				</div>

				{/* Right side */}
				<div className="flex items-center gap-4">
					{/* Auth + Theme */}
					<div className="hidden sm:flex items-center gap-3">
						{user ? (
							<>
								<div className="relative" ref={menuRef}>
									<button
										onClick={() => setMenuOpen(!menuOpen)}
										className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
									>
										{user.avatarUrl ? (
											<img
												src={user.avatarUrl}
												alt={user.name}
												className="h-8 w-8 rounded-full object-cover border"
											/>
										) : (
											<div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-800 dark:text-slate-100">
												{(user.name || 'U')
													.split(' ')
													.map((s) => s[0])
													.join('')
													.slice(0, 2)
													.toUpperCase()}
											</div>
										)}
									</button>

									{menuOpen && (
										<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border rounded-md shadow-lg py-2 z-50">
											<Link
												href="/auth/profile"
												className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700"
											>
												Profile
											</Link>
											<Separator />
											<button
												onClick={handleLogout}
												className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700"
											>
												Logout
											</button>
										</div>
									)}
								</div>

								{/* Cart icon */}
								{user?.role === 'customer' && (
									<Link
										href="/cart"
										className="px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 3h2l.4 2M7 13h10l4-8H5.4"
											/>
										</svg>
									</Link>
								)}
							</>
						) : (
							<>
								<Link
									href="/auth/login"
									className="px-4 py-1.5 rounded-full text-sm bg-rose-600 text-white hover:bg-rose-500 shadow-md transition"
								>
									Login
								</Link>
								<Link
									href="/auth/signup"
									className="px-4 py-1.5 rounded-full text-sm border hover:bg-slate-50 dark:hover:bg-slate-800 transition"
								>
									Sign up
								</Link>
							</>
						)}

						<Button
							aria-label="Toggle theme"
							onClick={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
							variant="ghost"
							size="icon"
							className="rounded-full border shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
						>
							{activeTheme === 'dark' ? (
								<Sun className="h-5 w-5 text-yellow-400" />
							) : (
								<Moon className="h-5 w-5 text-slate-700" />
							)}
						</Button>
					</div>

					{/* Mobile menu toggle */}
					<Button
						className="md:hidden p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
						onClick={() => setOpen(!open)}
						aria-label="Toggle menu"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
							/>
						</svg>
					</Button>
				</div>
			</div>

			{/* Mobile menu */}
			{open && (
				<div className="md:hidden border-t bg-white/90 dark:bg-black/70 animate-slide-down">
					<div className="flex flex-col px-4 py-4 gap-3 text-sm font-medium">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Link href="/" className="flex items-center gap-3">
									<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 via-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
										P
									</div>
									<span className="font-semibold">Platora</span>
								</Link>
							</div>
							{user ? (
								<div className="flex items-center gap-2">
									{user.avatarUrl ? (
										<img
											src={user.avatarUrl}
											alt={user.name}
											className="h-8 w-8 rounded-full object-cover border"
										/>
									) : (
										<div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-800 dark:text-slate-100">
											{user.name
												.split(' ')
												.map((s) => s[0])
												.join('')
												.slice(0, 2)
												.toUpperCase()}
										</div>
									)}
									<span className="text-sm">({user.role})</span>
								</div>
							) : null}
						</div>

						<Link href="/customer/dashboard" className="py-2 hover:text-rose-600">
							Customers
						</Link>
						<Link href="/restaurant/dashboard" className="py-2 hover:text-rose-600">
							Restaurants
						</Link>
						<Link href="/delivery/dashboard" className="py-2 hover:text-rose-600">
							Delivery
						</Link>
						<Link href="/admin/dashboard" className="py-2 hover:text-rose-600">
							Admin
						</Link>

						<div className="flex gap-3 pt-3">
							{user ? (
								<button
									onClick={handleLogout}
									className="flex-1 text-center py-2 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition"
								>
									Logout
								</button>
							) : (
								<>
									<Link
										href="/auth/login"
										className="flex-1 text-center py-2 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition"
									>
										Login
									</Link>
									<Link
										href="/auth/signup"
										className="flex-1 text-center py-2 rounded-full border hover:bg-slate-50 dark:hover:bg-slate-800 transition"
									>
										Sign up
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
}

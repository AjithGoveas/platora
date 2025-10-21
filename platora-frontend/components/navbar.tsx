'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from '@/components/ui/sheet';
import {IconMenu2} from '@tabler/icons-react';
import {useUserStore} from '@/store/user';

const navLinks = [
    {href: '/', label: 'Home'},
    {href: '/customer/restaurants', label: 'Restaurants'},
    {href: '/customer/orders', label: 'My Orders'},
    {href: '/customer/cart', label: 'Cart'},
    {href: '/payments/checkout', label: 'Checkout'},
    {href: '/auth/profile', label: 'Profile'},
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const {user, logout} = useUserStore();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
            <div className="h-16 flex items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold tracking-tight">
                    <span className="md:hidden">🍴 Platora</span>
                    <span className="hidden md:block">🍴 Platora</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-foreground/80',
                                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
              <span className="text-sm text-muted-foreground">
                {user.name} ({user.role})
              </span>
                            <Button variant="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/auth/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <IconMenu2 className="h-6 w-6"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4 mt-8 px-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            'text-lg font-medium transition-colors hover:text-foreground/80',
                                            pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="flex flex-col gap-2 mt-4">
                                    {user ? (
                                        <>
                      <span className="text-sm text-muted-foreground">
                        {user.name} ({user.role})
                      </span>
                                            <Button variant="outline" onClick={handleLogout}>
                                                Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" asChild>
                                                <Link href="/auth/login">Login</Link>
                                            </Button>
                                            <Button asChild>
                                                <Link href="/auth/signup">Sign Up</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function CustomerOrders() {
	// Orders API is not available in the current backend; show a friendly placeholder
	return (
		<main className="min-h-screen mt-16 p-8">
			<header className="mb-6">
				<h1 className="text-3xl font-semibold">My Orders</h1>
				<p className="text-muted-foreground mt-2">Track and manage your order history.</p>
			</header>

			<Card>
				<CardHeader>
					<CardTitle>No orders yet</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						You don't have any orders yet. Browse restaurants to get started.
					</p>
					<div className="mt-4">
						<Link href="/customer/restaurants">
							<Button>Explore Restaurants</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function RestaurantDashboard() {
	const restaurantId = (await cookies()).get('restaurantId')?.value || '1'; // Fallback to '1' if cookie not found
	return (
		<div className="min-h-screen mt-16 p-8">
			<header className="mb-12">
				<h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">Restaurant Dashboard</h1>
				<p className="text-lg text-gray-600 mt-4">
					Manage your restaurant, view orders, update your menu, and track performance.
				</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{/* Orders Management Card */}
				<Card className="shadow-xl border border-gray-200">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Orders Management</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">View and manage all incoming orders.</p>
						{/* Link: /restaurant/orders */}
						<Link href="/restaurant">
							<Button className="mt-4 w-full">Manage Orders</Button>
						</Link>
					</CardContent>
				</Card>

				{/* Menu Management Card */}
				<Card className="shadow-xl border border-gray-200">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Menu Management</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">Update and customize your restaurant menu.</p>
						{/* Link: /restaurant/menu */}
						<Link href={`/restaurant/${restaurantId}/menu`}>
							<Button className="mt-4 w-full">Update Menu</Button>
						</Link>
					</CardContent>
				</Card>

				{/* Performance Stats Card */}
				<Card className="shadow-xl border border-gray-200">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Performance Stats</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div>
								<p className="text-sm text-gray-600">Monthly Revenue</p>
								<Progress value={70} className="mt-2" />
								<p className="text-xs text-gray-500 mt-1">70% of your revenue goal</p>
							</div>
							<Separator />
							<div>
								<p className="text-sm text-gray-600">Customer Satisfaction</p>
								<Progress value={85} className="mt-2" />
								<p className="text-xs text-gray-500 mt-1">85% positive feedback</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Promotions Card */}
				<Card className="shadow-xl border border-gray-200">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Promotions</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">Create and manage promotional offers.</p>
						{/* Link: /restaurant/promotions */}
						<Link href="/restaurant">
							<Button className="mt-4 w-full">Manage Promotions</Button>
						</Link>
					</CardContent>
				</Card>

				{/* Reviews Card */}
				<Card className="shadow-xl border border-gray-200">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Customer Reviews</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">View and respond to customer reviews.</p>
						{/* Link: /restaurant/reviews */}
						<Link href="/restaurant">
							<Button className="mt-4 w-full">View Reviews</Button>
						</Link>
					</CardContent>
				</Card>

				{/* Support Card */}
				<Card className="shadow-xl border border-gray-200">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Support</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">Contact support for assistance with your account.</p>
						{/* Link: /restaurant/support */}
						<Link href="/restaurant">
							<Button className="mt-4 w-full">Get Support</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

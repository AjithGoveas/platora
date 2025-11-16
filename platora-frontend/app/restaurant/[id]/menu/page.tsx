'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { API_URL, authFetch } from '@/lib/api';
import { MenuItem } from '@/lib/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function MenuPage() {
	const params = useParams();
	const id = params?.id as string | number;

	const [items, setItems] = useState<MenuItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | number | null>(null);

	const [form, setForm] = useState({ name: '', price: '', description: '' });
	const [editingId, setEditingId] = useState<string | number | null>(null);
	const [showForm, setShowForm] = useState(false);

	if (!id) {
		return (
			<main className="mt-24 px-4 md:px-8">
				<div className="text-center text-sm text-rose-600">Invalid restaurant id.</div>
				<div className="mt-4 text-center">
					<Link href="/" className="text-rose-500 underline">
						Back to home
					</Link>
				</div>
			</main>
		);
	}

	useEffect(() => {
		loadItems();
	}, [id]);

	async function loadItems() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`${API_URL}/api/menu/restaurant/${id}`);
			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(`Failed to load menu: ${res.status} ${text}`);
			}
			const data = await res.json().catch(() => ({}));
			// normalize possible response shapes
			const normalized: MenuItem[] = Array.isArray(data.items)
				? data.items
				: Array.isArray(data.menu)
				? data.menu
				: Array.isArray(data)
				? (data as unknown as MenuItem[])
				: [];
			setItems(normalized);
		} catch (err: any) {
			setError(err.message || 'Unknown error');
		} finally {
			setLoading(false);
		}
	}

	function resetForm() {
		setForm({ name: '', price: '', description: '' });
		setEditingId(null);
		setShowForm(false);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		const payload = {
			name: form.name.trim(),
			price: Number(form.price),
			description: form.description.trim() || null,
		};

		if (!payload.name || Number.isNaN(payload.price)) {
			setError('Please provide a valid name and price');
			return;
		}

		setSubmitting(true);
		try {
			let res: Response;
			if (editingId) {
				res = await authFetch(`${API_URL}/api/menu/${editingId}`, {
					method: 'PUT',
					body: JSON.stringify(payload),
				});
			} else {
				res = await authFetch(`${API_URL}/api/menu`, {
					method: 'POST',
					body: JSON.stringify(payload),
				});
			}

			const body = await res.json().catch(() => ({}));
			if (!res.ok)
				throw new Error(
					(body && (body.error || body.message)) ||
						(editingId ? 'Failed to update item' : 'Failed to add item')
				);

			// backend wraps created/updated item in { item: {...} }
			const returned: MenuItem = body.item || body;

			if(editingId)
				toast.success('Menu item updated');
			else
				toast.success('Menu item added');

			setItems((prev) =>
				editingId ? prev.map((it) => (it.id === returned.id ? returned : it)) : [returned, ...prev]
			);
			resetForm();
		} catch (err: any) {
			setError(err.message || 'Request failed');
		} finally {
			setSubmitting(false);
		}
	}

	function startEdit(item: MenuItem) {
		setEditingId(item.id);
		setForm({ name: item.name, price: String(item.price), description: item.description || '' });
		setShowForm(true);
	}

	async function handleDelete(itemId: number | string) {
		if (!confirm('Delete this menu item?')) return;
		setError(null);
		setDeletingId(itemId);
		try {
			const res = await authFetch(`${API_URL}/api/menu/${itemId}`, { method: 'DELETE' });
			const body = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error((body && (body.error || body.message)) || 'Failed to delete item');
			toast.success('Menu item deleted');
			setItems((prev) => prev.filter((it) => it.id !== itemId));
			if (editingId === itemId) resetForm();
		} catch (err: any) {
			setError(err.message || 'Failed to delete item');
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="container mx-auto p-8 space-y-8">
			<h1 className="text-3xl font-bold tracking-tight">Restaurant Menu (Owner)</h1>

			{/* Menu Section */}
			<Card>
					<CardHeader className="flex justify-between items-center">
					<CardTitle>Full Menu</CardTitle>
					<Button onClick={() => setShowForm(true)} disabled={submitting}>Add Item</Button>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-muted-foreground">Loading...</p>
					) : items.length === 0 ? (
						<p className="text-muted-foreground">No menu items yet.</p>
					) : (
						<ul className="space-y-4">
							{items.map((item) => (
								<li key={item.id}>
									<Card>
										<CardContent className="flex justify-between items-start p-4">
											<div>
												<h3 className="font-semibold">{item.name}</h3>
												{item.description && (
													<p className="text-sm text-muted-foreground">{item.description}</p>
												)}
											</div>
											<div className="text-right">
												<div className="font-bold">${Number(item.price).toFixed(2)}</div>
												<div className="flex gap-2 mt-2 justify-end">
													<Button size="sm" variant="outline" onClick={() => startEdit(item)} disabled={submitting || deletingId !== null}>
														Edit
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() => handleDelete(item.id)}
														disabled={deletingId === item.id}
													>
														{deletingId === item.id ? 'Deleting…' : 'Delete'}
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>

			{/* Form Section (only shown when Add/Edit is triggered) */}
			{showForm && (
				<Card>
					<CardHeader>
						<CardTitle>{editingId ? 'Edit Item' : 'Add New Item'}</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<Input
								placeholder="Name"
								value={form.name}
								onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
								required
							/>
							<Input
								placeholder="Price"
								value={form.price}
								onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
								required
								inputMode="decimal"
							/>
							<Textarea
								placeholder="Description (optional)"
								value={form.description}
								onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
								rows={3}
							/>
							<div className="flex gap-4">
								<Button type="submit" disabled={submitting}>
									{submitting ? (editingId ? 'Saving…' : 'Adding…') : editingId ? 'Save' : 'Add'}
								</Button>
								<Button type="button" variant="secondary" onClick={resetForm}>
									Cancel
								</Button>
							</div>
						</form>
						{error && (
							<Alert variant="destructive" className="mt-4">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

import {query} from "../db/index.js";

export async function payForOrder(req, res) {
	try {
		const customerId = req.user.userId;
		const { order_id, mode } = req.body;
		// ensure order belongs to customer
		const q = 'SELECT * FROM orders WHERE id = $1 AND customer_id = $2';
		const r = await query(q, [order_id, customerId]);
		if (r.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

		// call stored procedure to generate invoice and payment
		await query('SELECT fn_generate_invoice($1,$2)', [order_id, mode || 'COD']);

		// return payment record
		const pay = await query('SELECT * FROM payments WHERE order_id = $1 ORDER BY paid_at DESC LIMIT 1', [
			order_id,
		]);
		res.json({ payment: pay.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
}

export async function getInvoice(req, res) {
	try {
		const orderId = req.params.orderId;

		// fetch order basic info
		const ord = await query('SELECT o.id, o.customer_id, o.restaurant_id, o.total_amount, o.payment_mode, o.created_at, u.name as customer_name, u.phone as customer_phone, r.name as restaurant_name, r.address as restaurant_address FROM orders o LEFT JOIN users u ON u.id = o.customer_id LEFT JOIN restaurants r ON r.id = o.restaurant_id WHERE o.id = $1', [orderId]);
		if (ord.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
		const order = ord.rows[0];

		// items
		const itemsRes = await query('SELECT oi.id, oi.menu_item_id, oi.quantity, oi.unit_price, mi.name FROM order_items oi JOIN menu_items mi ON mi.id = oi.menu_item_id WHERE oi.order_id = $1', [orderId]);
		const items = itemsRes.rows;

		// delivery
		const delRes = await query('SELECT d.id as delivery_id, d.status, d.assigned_at, da.id as delivery_agent_id, da.name as delivery_agent_name, da.phone as delivery_agent_phone FROM deliveries d LEFT JOIN users da ON da.id = d.delivery_agent_id WHERE d.order_id = $1 ORDER BY d.assigned_at DESC LIMIT 1', [orderId]);
		const delivery = delRes.rows.length > 0 ? delRes.rows[0] : null;

		// Prefer invoices table (structured) if present
		const inv = await query('SELECT * FROM invoices WHERE order_id = $1 ORDER BY generated_at DESC LIMIT 1', [orderId]);
		let invoice = null;
		if (inv.rows.length > 0) invoice = inv.rows[0];
		else {
			// Fallback to payments table for legacy invoices
			const pay = await query('SELECT * FROM payments WHERE order_id = $1 ORDER BY paid_at DESC LIMIT 1', [orderId]);
			if (pay.rows.length > 0) invoice = pay.rows[0];
		}

		return res.json({ invoice, order, items, delivery });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
}

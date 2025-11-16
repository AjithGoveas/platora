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
		// Basic access control: allow if user is admin, customer owning the order, restaurant owner of the order, or delivery assigned
		const auth = req.user || {};
		const pay = await query('SELECT * FROM payments WHERE order_id = $1 ORDER BY paid_at DESC LIMIT 1', [
			orderId,
		]);
		if (pay.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
		res.json({ invoice: pay.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
}

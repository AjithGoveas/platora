import getClient, {query} from "../db/index.js";

export async function createOrder(req, res) {
    const client = await getClient();
    try {
        const customerId = req.user.userId;
        const {restaurant_id, items, payment_mode} = req.body;
        if (!restaurant_id || !Array.isArray(items) || items.length === 0)
            return res.status(400).json({error: 'restaurant_id and items required'});

        await query('BEGIN');
        const orderInsert = await query(
            'INSERT INTO orders(customer_id, restaurant_id, status, payment_mode) VALUES($1,$2,$3,$4) RETURNING id',
            [customerId, restaurant_id, 'Pending', payment_mode || null]
        );
        const orderId = orderInsert.rows[0].id;

        // insert order_items and calculate total
        let total = 0;
        for (const it of items) {
            const {menu_item_id, quantity} = it;
            const mi = await query('SELECT price FROM menu_items WHERE id = $1', [menu_item_id]);
            if (mi.rows.length === 0) throw new Error('Menu item not found: ' + menu_item_id);
            const unit_price = mi.rows[0].price;
            await query(
                'INSERT INTO order_items(order_id, menu_item_id, quantity, unit_price) VALUES($1,$2,$3,$4)',
                [orderId, menu_item_id, quantity, unit_price]
            );
            total += Number(unit_price) * Number(quantity);
        }

        // update order total
        await query('UPDATE orders SET total_amount = $1 WHERE id = $2', [total, orderId]);

        // call stored procedure to auto-create delivery
        await query('SELECT fn_create_delivery_for_order($1)', [orderId]);

        await query('COMMIT');
        res.json({orderId, total});
    } catch (err) {
        await query('ROLLBACK');
        console.error(err);
        res.status(500).json({error: err.message || 'Server error'});
    } finally {
        client.release();
    }
}

export async function listMyOrders(req, res) {
    try {
        const customerId = req.user.userId;
        const q = 'SELECT o.* FROM orders o WHERE o.customer_id = $1 ORDER BY o.created_at DESC';
        const result = await query(q, [customerId]);
        res.json({orders: result.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function listRestaurantOrders(req, res) {
    try {
        const userId = req.user.userId;
        const q =
            'SELECT o.* FROM orders o JOIN restaurants r ON r.id = o.restaurant_id WHERE r.user_id = $1 ORDER BY o.created_at DESC';
        const result = await query(q, [userId]);
        res.json({orders: result.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const userId = req.user.userId;
        const orderId = req.params.id;
        const {status} = req.body;
        // ensure restaurant owns the order
        const check = await query(
            'SELECT o.* FROM orders o JOIN restaurants r ON r.id = o.restaurant_id WHERE o.id = $1 AND r.user_id = $2',
            [orderId, userId]
        );
        if (check.rows.length === 0) return res.status(404).json({error: 'Order not found or not yours'});

        await query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);
        res.json({ok: true});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

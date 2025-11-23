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
            if (mi.rows.length === 0) {
                await query('ROLLBACK');
                return res.status(400).json({ error: 'Menu item not found: ' + menu_item_id });
            }
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

        // fetch delivery and assigned agent info to return to client
        const delRes = await query(
            `SELECT d.id as delivery_id, d.delivery_agent_id, da.name as delivery_agent_name, da.phone as delivery_agent_phone, d.status, d.assigned_at
             FROM deliveries d
             LEFT JOIN users da ON da.id = d.delivery_agent_id
             WHERE d.order_id = $1
             ORDER BY d.assigned_at DESC
             LIMIT 1`,
            [orderId]
        );
        const delivery = delRes.rows.length > 0 ? delRes.rows[0] : null;

        // Normalize assigned agent for frontend compatibility
        let assignedAgent = null;
        if (delivery && delivery.delivery_agent_id) {
            assignedAgent = {
                id: delivery.delivery_agent_id,
                name: delivery.delivery_agent_name || null,
                phone: delivery.delivery_agent_phone || null,
            };
        }

        await query('COMMIT');
        // Return both a detailed delivery object and a normalized assignedAgent key
        // Include legacy keys `orderId` and `order_id` so frontend code that expects
        // those names (CheckoutButton) can find the created order id.
        res.json({id: orderId, orderId: orderId, order_id: orderId, total, delivery, assignedAgent});
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
        // Include latest delivery info (if any) using LATERAL join to fetch one delivery row per order
        const q = `
      SELECT o.id, o.customer_id, o.restaurant_id, o.total_amount, o.status, o.payment_mode, o.created_at,
        dlast.delivery_agent_id, dlast.delivery_agent_name, dlast.delivery_agent_phone, dlast.delivery_status,
        COALESCE(json_agg(json_build_object('id', oi.id, 'menu_item_id', oi.menu_item_id, 'quantity', oi.quantity, 'unit_price', oi.unit_price, 'name', mi.name) ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
      FROM orders o
      LEFT JOIN LATERAL (
        SELECT d.delivery_agent_id, da.name as delivery_agent_name, da.phone as delivery_agent_phone, d.status as delivery_status
        FROM deliveries d LEFT JOIN users da ON da.id = d.delivery_agent_id
        WHERE d.order_id = o.id
        ORDER BY d.assigned_at DESC
        LIMIT 1
      ) dlast ON true
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
      WHERE o.customer_id = $1
      GROUP BY o.id, dlast.delivery_agent_id, dlast.delivery_agent_name, dlast.delivery_agent_phone, dlast.delivery_status
      ORDER BY o.created_at DESC
    `;
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
        const q = `
            SELECT o.id, o.customer_id, o.restaurant_id, o.total_amount, o.status, o.payment_mode, o.created_at,
              dlast.delivery_agent_id, dlast.delivery_agent_name, dlast.delivery_agent_phone, dlast.delivery_status,
              COALESCE(json_agg(json_build_object('id', oi.id, 'menu_item_id', oi.menu_item_id, 'quantity', oi.quantity, 'unit_price', oi.unit_price, 'name', mi.name) ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
            FROM orders o
            JOIN restaurants r ON r.id = o.restaurant_id
            LEFT JOIN LATERAL (
              SELECT d.delivery_agent_id, da.name as delivery_agent_name, da.phone as delivery_agent_phone, d.status as delivery_status
              FROM deliveries d LEFT JOIN users da ON da.id = d.delivery_agent_id
              WHERE d.order_id = o.id
              ORDER BY d.assigned_at DESC
              LIMIT 1
            ) dlast ON true
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
            WHERE r.user_id = $1
            GROUP BY o.id, dlast.delivery_agent_id, dlast.delivery_agent_name, dlast.delivery_agent_phone, dlast.delivery_status
            ORDER BY o.created_at DESC
        `;
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

export async function getOrderDetails(req, res) {
    try {
        const orderId = req.params.id;

        // Fetch order with customer and restaurant names
        const ordQ = `SELECT o.*, u.name as customer_name, r.name as restaurant_name
                      FROM orders o
                      LEFT JOIN users u ON u.id = o.customer_id
                      LEFT JOIN restaurants r ON r.id = o.restaurant_id
                      WHERE o.id = $1`;
        const ordR = await query(ordQ, [orderId]);
        if (ordR.rows.length === 0) return res.status(404).json({error: 'Order not found'});

        const order = ordR.rows[0];

        // fetch order items
        const itemsQ = `
      SELECT oi.id, oi.menu_item_id, oi.quantity, oi.unit_price, mi.name
      FROM order_items oi
      JOIN menu_items mi ON mi.id = oi.menu_item_id
      WHERE oi.order_id = $1
    `;
        const items = await query(itemsQ, [orderId]);

        res.json({
            id: order.id,
            customer_id: order.customer_id,
            restaurant_id: order.restaurant_id,
            total_amount: order.total_amount,
            status: order.status,
            payment_mode: order.payment_mode,
            created_at: order.created_at,
            customer_name: order.customer_name,
            restaurant_name: order.restaurant_name,
            items: items.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

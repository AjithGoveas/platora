import {query} from "../db/index.js";

// List deliveries assigned to the logged-in delivery agent
export async function listMyDeliveries(req, res) {
    try {
        const userId = req.user.userId; // must be set by auth middleware
        const q = `
      SELECT *
      FROM fn_get_deliveries_for_agent($1)
    `;
        const result = await query(q, [userId]);
        res.json({deliveries: result.rows});
    } catch (err) {
        console.error("listMyDeliveries error:", err);
        res.status(500).json({error: "Server error"});
    }
}

// Update delivery status
export async function updateStatus(req, res) {
    try {
        const userId = req.user.userId;
        const deliveryId = req.params.id;
        const {status} = req.body; // Allowed: Assigned, Picked, On the Way, Delivered

        // Ensure delivery is assigned to this agent
        const check = await query(
            "SELECT id FROM deliveries WHERE id = $1 AND delivery_agent_id = $2",
            [deliveryId, userId]
        );

        if (check.rows.length === 0) {
            return res
                .status(404)
                .json({error: "Delivery not found or not assigned to you"});
        }

        // Update delivery status
        await query(
            "UPDATE deliveries SET status = $1, updated_at = now() WHERE id = $2",
            [status, deliveryId]
        );

        // If delivered, update order status too
        if (status === "Delivered") {
            await query(
                `UPDATE orders
                 SET status = $1
                 WHERE id = (SELECT order_id FROM deliveries WHERE id = $2)`,
                ["Delivered", deliveryId]
            );
        }

        res.json({ok: true});
    } catch (err) {
        console.error("updateStatus error:", err);
        res.status(500).json({error: "Server error"});
    }
}

import {query} from "../db/index.js";

export async function listDeliveryAgents(req, res) {
    try {
        // return basic public-facing fields for delivery agents
        const q = `SELECT id, name, phone FROM users WHERE role = $1 ORDER BY name`;
        const result = await query(q, ['delivery']);
        // respond with { agents: [...] } to make frontend normalization easier
        res.json({agents: result.rows});
    } catch (err) {
        console.error('listDeliveryAgents error:', err);
        res.status(500).json({error: 'Server error'});
    }
}


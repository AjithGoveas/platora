import {query} from "../db/index.js";

export async function list(req, res) {
    try {
        const q =
            'SELECT r.*, u.email as owner_email, u.name as owner_name FROM restaurants r LEFT JOIN users u ON u.id = r.user_id WHERE r.is_active = true';
        const result = await query(q);
        res.json({restaurants: result.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function getById(req, res) {
    try {
        const id = req.params.id;
        const r_id = parseInt(id);
        const q = 'SELECT r.*, u.email as owner_email, u.name as owner_name FROM restaurants r LEFT JOIN users u ON u.id = r.user_id WHERE r.id = $1 LIMIT 1';
        const result = await query(q, [r_id]);
        if (!result.rows.length) return res.status(404).json({error: 'Restaurant not found'});
        res.json({restaurant: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function create(req, res) {
    try {
        const {user_id, name, address, phone} = req.body;
        if (!user_id || !name) return res.status(400).json({error: 'user_id and name required'});
        const q = 'INSERT INTO restaurants(user_id, name, address, phone) VALUES($1,$2,$3,$4) RETURNING *';
        const result = await query(q, [user_id, name, address || null, phone || null]);
        res.json({restaurant: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function getMyRestaurant(req, res) {
    try {
        const userId = req.user.userId;
        const q = 'SELECT * FROM restaurants WHERE user_id = $1';
        const result = await query(q, [userId]);
        if (result.rows.length === 0) return res.status(404).json({error: 'No restaurant found for this user'});
        res.json({restaurant: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function updateMyRestaurant(req, res) {
    try {
        const userId = req.user.userId;
        const {name, address, phone, is_active} = req.body;
        const q =
            'UPDATE restaurants SET name = COALESCE($1,name), address = COALESCE($2,address), phone = COALESCE($3,phone), is_active = COALESCE($4,is_active) WHERE user_id = $5 RETURNING *';
        const result = await query(q, [
            name || null,
            address || null,
            phone || null,
            is_active === undefined ? null : is_active,
            userId,
        ]);
        if (result.rows.length === 0) return res.status(404).json({error: 'No restaurant found for this user'});
        res.json({restaurant: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function deleteRestaurant(req, res) {
    try {
        const id = req.params.id;
        await query('DELETE FROM restaurants WHERE id = $1', [id]);
        res.json({ok: true});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

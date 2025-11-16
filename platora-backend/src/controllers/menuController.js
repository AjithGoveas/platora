import {query} from "../db/index.js";

export async function listByRestaurant(req, res) {
    try {
        // Route uses :restaurantId (camelCase) so read that param. Keep compatibility with snake_case if present.
        const restaurantId = req.params.restaurantId;
        const q = 'SELECT * FROM menu_items WHERE restaurant_id = $1';
        const result = await query(q, [restaurantId]);
        res.json({items: result.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function create(req, res) {
    try {
        const userId = req.user.userId;
        // get restaurant for this user
        const r = await query('SELECT id FROM restaurants WHERE user_id = $1', [userId]);
        if (r.rows.length === 0) return res.status(400).json({error: 'No restaurant associated with this user'});
        const restaurantId = r.rows[0].id;
        const {name, description, price, is_available} = req.body;
        if (!name || price === undefined) return res.status(400).json({error: 'name and price required'});
        const q =
            'INSERT INTO menu_items(restaurant_id, name, description, price, is_available) VALUES($1,$2,$3,$4,$5) RETURNING *';
        const result = await query(q, [
            restaurantId,
            name,
            description || null,
            price,
            is_available === undefined ? true : is_available,
        ]);
        res.json({item: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function update(req, res) {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        // ensure item belongs to user's restaurant
        const check = await query(
            'SELECT mi.* FROM menu_items mi JOIN restaurants r ON r.id = mi.restaurant_id WHERE mi.id = $1 AND r.user_id = $2',
            [id, userId]
        );
        if (check.rows.length === 0) return res.status(404).json({error: 'Menu item not found or not owned by you'});
        const {name, description, price, is_available} = req.body;
        const q =
            'UPDATE menu_items SET name = COALESCE($1,name), description = COALESCE($2,description), price = COALESCE($3,price), is_available = COALESCE($4,is_available) WHERE id = $5 RETURNING *';
        const result = await query(q, [
            name || null,
            description || null,
            price === undefined ? null : price,
            is_available === undefined ? null : is_available,
            id,
        ]);
        res.json({item: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function remove(req, res) {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        // ensure item belongs to user's restaurant
        const check = await query(
            'SELECT mi.* FROM menu_items mi JOIN restaurants r ON r.id = mi.restaurant_id WHERE mi.id = $1 AND r.user_id = $2',
            [id, userId]
        );
        if (check.rows.length === 0) return res.status(404).json({error: 'Menu item not found or not owned by you'});
        await query('DELETE FROM menu_items WHERE id = $1', [id]);
        res.json({ok: true});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

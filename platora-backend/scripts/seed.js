import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import getClient from "../src/db/index.js";
import bcrypt from "bcrypt";

dotenv.config();

const SCHEMA_PATH = path.join(new URL(import.meta.url).pathname, '..', '..', 'sql', 'schema.sql');

function tag(msg, ...args) {
    console.log('[seed]', msg, ...args);
}

async function ensureSchema(client) {
    const check = await client.query("SELECT to_regclass('public.users') AS exists");
    if (check.rows[0] && check.rows[0].exists) return;

    if (!fs.existsSync(SCHEMA_PATH)) {
        throw new Error(`Schema missing and ${SCHEMA_PATH} not found`);
    }

    let sql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    sql = sql
        .split('\n')
        .filter((ln) => {
            const t = ln.trim();
            if (!t) return true;
            return !t.startsWith('```') && !t.startsWith('//');
        })
        .join('\n');

    tag('Applying schema from', SCHEMA_PATH);
    await client.query(sql);
    tag('Schema applied');
}

async function truncateAll(client) {
    await client.query('TRUNCATE order_items, deliveries, payments, orders, menu_items, restaurants, users RESTART IDENTITY CASCADE');
}

async function findIdBy(client, table, column, value) {
    const q = `SELECT id
               FROM ${table}
               WHERE ${column} = $1 LIMIT 1`;
    const r = await client.query(q, [value]);
    return r.rows.length ? r.rows[0].id : null;
}

async function insertRow(client, table, values) {
    const cols = Object.keys(values);
    const params = cols.map((_, i) => `$${i + 1}`).join(', ');
    const q = `INSERT INTO ${table}(${cols.join(',')})
               VALUES (${params}) RETURNING id`;
    const r = await client.query(q, Object.values(values));
    return r.rows[0].id;
}

async function upsertUserByEmail(client, user) {
    const existing = await findIdBy(client, 'users', 'email', user.email);
    if (existing) {
        await client.query('UPDATE users SET name=$1, phone=$2, role=$3 WHERE id=$4', [user.name, user.phone, user.role, existing]);
        return existing;
    }
    return insertRow(client, 'users', user);
}

async function upsertRestaurantByName(client, rest) {
    const existing = await findIdBy(client, 'restaurants', 'name', rest.name);
    if (existing) {
        await client.query('UPDATE restaurants SET user_id=$1, address=$2, phone=$3, is_active=$4 WHERE id=$5', [rest.user_id, rest.address, rest.phone, rest.is_active, existing]);
        return existing;
    }
    return insertRow(client, 'restaurants', rest);
}

async function addMenuIfMissing(client, restaurant_id, name, description, price, is_available) {
    const q = 'SELECT id FROM menu_items WHERE name=$1 AND restaurant_id=$2 LIMIT 1';
    const r = await client.query(q, [name, restaurant_id]);
    if (r.rows.length) return r.rows[0].id;
    return insertRow(client, 'menu_items', {
        restaurant_id,
        name,
        description: description || null,
        price,
        is_available
    });
}

async function createOrderWithItems(client, customerId, restaurantId, status, paymentMode, items) {
    const orderId = await insertRow(client, 'orders', {
        customer_id: customerId,
        restaurant_id: restaurantId,
        total_amount: 0,
        status: status,
        payment_mode: paymentMode
    });
    let total = 0;
    for (const it of items) {
        const unit = it.unit_price != null ? it.unit_price : (await client.query('SELECT price FROM menu_items WHERE id=$1', [it.menu_item_id])).rows[0].price;
        await insertRow(client, 'order_items', {
            order_id: orderId,
            menu_item_id: it.menu_item_id,
            quantity: it.quantity,
            unit_price: unit
        });
        total += Number(unit) * Number(it.quantity);
    }
    await client.query('UPDATE orders SET total_amount=$1 WHERE id=$2', [total, orderId]);
    return orderId;
}

async function seedMain(options = {wipe: false, dry: false}) {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set. Create a .env file in platora-backend with DATABASE_URL (see .env)');
    }

    const client = await getClient();
    try {
        tag('Seed started', options);
        await client.query('BEGIN');

        await ensureSchema(client);

        if (options.wipe) {
            tag('Truncating existing data...');
            await truncateAll(client);
        }

        const plainPassword = process.env.SEED_PASSWORD || 'Password123!';
        const passwordHash = await bcrypt.hash(plainPassword, 10);

        const users = {};
        users.admin = await upsertUserByEmail(client, {
            email: 'admin@example.com',
            password_hash: passwordHash,
            name: 'Admin User',
            phone: '555-0001',
            role: 'admin'
        });
        users.alice = await upsertUserByEmail(client, {
            email: 'alice@example.com',
            password_hash: passwordHash,
            name: 'Alice Example',
            phone: '555-1001',
            role: 'customer'
        });
        users.bob = await upsertUserByEmail(client, {
            email: 'bob@example.com',
            password_hash: passwordHash,
            name: 'Bob Example',
            phone: null,
            role: 'customer'
        });
        users.pasta_owner = await upsertUserByEmail(client, {
            email: 'pasta_owner@example.com',
            password_hash: passwordHash,
            name: 'Pasta Place Owner',
            phone: '555-2001',
            role: 'restaurant'
        });
        users.sushi_owner = await upsertUserByEmail(client, {
            email: 'sushi_owner@example.com',
            password_hash: passwordHash,
            name: 'Sushi Spot Owner',
            phone: '555-2002',
            role: 'restaurant'
        });
        users.dave = await upsertUserByEmail(client, {
            email: 'dave.delivery@example.com',
            password_hash: passwordHash,
            name: 'Dave Delivery',
            phone: '555-3001',
            role: 'delivery'
        });
        users.emma = await upsertUserByEmail(client, {
            email: 'emma.delivery@example.com',
            password_hash: passwordHash,
            name: 'Emma Delivery',
            phone: null,
            role: 'delivery'
        });

        tag('Users seeded/updated (sample password on all accounts):', plainPassword);

        const pastaId = await upsertRestaurantByName(client, {
            user_id: users.pasta_owner,
            name: 'Pasta Palace',
            address: '123 Noodle St',
            phone: '555-4001',
            is_active: true
        });
        const sushiId = await upsertRestaurantByName(client, {
            user_id: users.sushi_owner,
            name: 'Sushi Central',
            address: '99 Fish Ave',
            phone: '555-4002',
            is_active: false
        });

        const mi = {};
        mi.carbonara = await addMenuIfMissing(client, pastaId, 'Spaghetti Carbonara', 'Classic creamy carbonara with pancetta', 12.5, true);
        mi.arrabiata = await addMenuIfMissing(client, pastaId, 'Penne Arrabiata', 'Spicy tomato sauce', 10.0, true);
        mi.nigiri = await addMenuIfMissing(client, sushiId, 'Salmon Nigiri', 'Fresh salmon over rice', 3.5, true);
        mi.dragon = await addMenuIfMissing(client, sushiId, 'Dragon Roll', 'Tempura shrimp and avocado roll', 14.0, false);

        tag('Menu items prepared');

        const o1 = await createOrderWithItems(client, users.alice, pastaId, 'Pending', 'Card', [{
            menu_item_id: mi.carbonara,
            quantity: 2
        }, {menu_item_id: mi.arrabiata, quantity: 1}]);
        await createOrderWithItems(client, users.bob, pastaId, 'Preparing', 'Cash', [{
            menu_item_id: mi.carbonara,
            quantity: 8
        }]);
        await createOrderWithItems(client, null, sushiId, 'Ready for Pickup', 'Card', [{
            menu_item_id: mi.nigiri,
            quantity: 2
        }]);
        const o4 = await createOrderWithItems(client, users.alice, pastaId, 'Out for Delivery', 'Card', [{
            menu_item_id: mi.arrabiata,
            quantity: 2
        }]);
        await insertRow(client, 'deliveries', {
            order_id: o4,
            delivery_agent_id: users.dave,
            status: 'On the Way',
            assigned_at: new Date(),
            updated_at: new Date()
        });
        const o5 = await createOrderWithItems(client, users.bob, sushiId, 'Delivered', 'Online', [{
            menu_item_id: mi.nigiri,
            quantity: 8
        }]);
        await insertRow(client, 'payments', {
            order_id: o5,
            amount: 28.0,
            mode: 'Online',
            paid_at: new Date(),
            invoice_text: `Invoice for order ${o5}: Total: 28.00`
        });
        await createOrderWithItems(client, users.alice, pastaId, 'Cancelled', null, []);

        const tempMenuId = await insertRow(client, 'menu_items', {
            restaurant_id: pastaId,
            name: 'Temporary Item',
            description: 'Temp (will be deleted)',
            price: 1.0,
            is_available: true
        });
        await createOrderWithItems(client, users.alice, pastaId, 'Pending', 'Cash', [{
            menu_item_id: tempMenuId,
            quantity: 1
        }]);
        await client.query('DELETE FROM menu_items WHERE id=$1', [tempMenuId]);

        try {
            await client.query('SELECT fn_generate_invoice($1,$2)', [o1, 'Card']);
        } catch (e) {
        }
        try {
            await client.query('SELECT fn_create_delivery_for_order($1)', [o5]);
        } catch (e) {
        }

        if (options && options.dry) {
            await client.query('ROLLBACK');
            tag('Dry-run: rolled back (no changes persisted)');
        } else {
            await client.query('COMMIT');
            tag('Seed committed');
        }

        if (!(options && options.dry)) {
            const totals = {};
            for (const t of ['users', 'restaurants', 'menu_items', 'orders', 'order_items', 'deliveries', 'payments']) {
                const r = await client.query(`SELECT COUNT(*) ::int as c
                                              FROM ${t}`);
                totals[t] = r.rows[0].c;
            }
            tag('Totals after seed:', totals);
            tag('Sample seeded user password (all accounts):', plainPassword);
        }

    } catch (err) {
        try {
            await client.query('ROLLBACK');
        } catch (e) {
        }
        throw err;
    } finally {
        client.release();
    }
}

(async () => {
    try {
        const args = process.argv.slice(2);
        const wipe = args.includes('--wipe');
        const dry = args.includes('--dry');
        await seedMain({wipe, dry});
        process.exit(0);
    } catch (err) {
        console.error('[seed] Error:', err.message || err);
        process.exit(1);
    }
})();

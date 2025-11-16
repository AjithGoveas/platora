import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import z from 'zod';
import {query} from "../db/index.js";

const signupSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
	name: z.string().min(1),
	phone: z.string().optional(),
	role: z.enum(['admin', 'customer', 'restaurant', 'delivery']),
});

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function signup(req, res) {
	try {
		const parsed = signupSchema.parse(req.body);
		const { email, password, name, phone, role } = parsed;

		// check existing
		const exists = await query('SELECT id FROM users WHERE email = $1', [email]);
		if (exists.rows.length > 0) return res.status(400).json({ error: 'Email already registered' });

		const hash = await bcrypt.hash(password, 10);
		const result = await query(
			'INSERT INTO users (email, password_hash, name, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, email, name, role',
			[email, hash, name, phone || null, role]
		);

		const user = result.rows[0];
		const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

		res.json({ token, user });
	} catch (err) {
		if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
}

export async function login(req, res) {
	try {
		const parsed = loginSchema.parse(req.body);
		const { email, password } = parsed;

		const result = await query('SELECT id, email, password_hash, name, role FROM users WHERE email = $1', [
			email,
		]);
		if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

		const user = result.rows[0];
		const ok = await bcrypt.compare(password, user.password_hash);
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

		const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
		res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
	} catch (err) {
		if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
}

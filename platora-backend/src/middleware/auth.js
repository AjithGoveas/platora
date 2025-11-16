import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function authenticate(req, res, next) {
	const auth = req.headers.authorization;
	if (!auth) return res.status(401).json({ error: 'Missing authorization header' });
	const parts = auth.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer')
		return res.status(401).json({ error: 'Invalid authorization format' });
	const token = parts[1];
	try {
        req.user = jwt.verify(token, JWT_SECRET); // { userId, role, iat, exp }
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
}

function authorize(allowedRoles = []) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
		if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		next();
	};
}

export {authorize, authenticate};

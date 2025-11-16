import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function sign(payload, opts = {}) {
	return jwt.sign(payload, JWT_SECRET, opts);
}

function verify(token) {
	return jwt.verify(token, JWT_SECRET);
}

export default {verify, sign};
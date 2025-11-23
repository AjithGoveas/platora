import {Pool} from "pg";
import dotenv from "dotenv";
import pkg from "pg/lib/defaults.js";

const {options} = pkg;

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:root@localhost:5432/platora_db",
    // optionally use SSL config in production
});

export const query = (text, params) => pool.query(text, params);

const getClient = async () => {
    return await pool.connect(options);
};
export default getClient;

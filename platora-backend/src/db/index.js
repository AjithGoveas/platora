import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// SSL Configuration for production environments like Vercel
// This is often mandatory for cloud databases (like Supabase)
const sslConfig = process.env.NODE_ENV === 'production' ? {
    // Requires the client to connect with a secure SSL connection
    ssl: {
        rejectUnauthorized: false // This is typically required for self-signed certificates in cloud environments like Supabase
    }
} : {}; // No SSL required for local development (localhost)

// Configure the connection pool
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:root@localhost:5432/platora_db",
    ...sslConfig, // Spread the SSL configuration here
    // Note: The pkg and options imports were removed as they were unused or incorrect.
});

// Helper function for direct queries
export const query = (text, params) => pool.query(text, params);

// Function to get a client connection from the pool
const getClient = async () => {
    // Note: Pool.connect() does not take the 'options' parameter as you had before.
    return await pool.connect();
};

export default getClient;
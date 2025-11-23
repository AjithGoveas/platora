import app from '../src/app.js';
import initDbSchema from '../src/db/init.js'; // Assuming initDbSchema or db config is in src/db/

// Initialize the database schema once when the function cold-starts
let isDbInitialized = false;
async function initializeDatabase() {
    if (!isDbInitialized) {
        console.log('Attempting to initialize database schema...');
        // Note: This relies on your initDbSchema file being updated with SSL config.
        await initDbSchema();
        isDbInitialized = true;
        console.log('Database schema initialization complete.');
    }
}

// 4. Serverless Handler Wrapper
// This function initializes the DB and then passes the request to the Express app.
export default async function handler(req, res) {
    // Ensure the database is initialized on the first run in the serverless environment
    await initializeDatabase();

    // Pass the request to the fully configured Express app imported from src/app.js
    app(req, res);
}
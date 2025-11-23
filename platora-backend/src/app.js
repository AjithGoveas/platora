import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import initDbSchema from './db/init.js';
import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import menuRoutes from "./routes/menu.js";
import ordersRoutes from "./routes/orders.js";
import paymentsRoutes from "./routes/payments.js";
import deliveriesRoutes from "./routes/deliveries.js";
import agentsRoutes from "./routes/agents.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api', (req, res) => res.json({ok: true, msg: 'Online Food Delivery API'}));
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/deliveries', deliveriesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api', agentsRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // Initialize DB schema on server start
    initDbSchema().catch(err => {
        console.error('Error initializing database schema:', err);
    });
})
export default app;

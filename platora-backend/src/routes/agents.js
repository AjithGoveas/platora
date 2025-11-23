import express from 'express';
import { listDeliveryAgents } from '../controllers/agentsController.js';
const router = express.Router();

// Public endpoint to list delivery agents (no auth required)
router.get('/delivery-agents', listDeliveryAgents);

export default router;


import express from "express";
import {authenticate, authorize} from "../middleware/auth.js";
import {listMyDeliveries, updateStatus} from "../controllers/deliveriesController.js";
const router = express.Router();

// Delivery agent views assigned deliveries
router.get('/my', authenticate, authorize(['delivery']), listMyDeliveries);
// Delivery agent updates delivery status
router.put('/:id/status', authenticate, authorize(['delivery']), updateStatus);

export default router;

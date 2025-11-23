import {authenticate, authorize} from "../middleware/auth.js";
import * as controller from "../controllers/ordersController.js";
import express from "express";

const router = express.Router();

// Customer creates order
router.post('/', authenticate, authorize(['customer']), controller.createOrder);
// Customer views their orders
router.get('/my', authenticate, authorize(['customer']), controller.listMyOrders);
// Restaurant views orders for their restaurant
router.get('/restaurant', authenticate, authorize(['restaurant']), controller.listRestaurantOrders);
// Restaurant updates order status (accept/reject/update status)
router.put('/:id/status', authenticate, authorize(['restaurant']), controller.updateOrderStatus);
// Customer views order details (also accessible to restaurant/delivery as appropriate)
router.get('/:id', authenticate, controller.getOrderDetails);

export default router;

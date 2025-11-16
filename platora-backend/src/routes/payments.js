import {authenticate, authorize} from "../middleware/auth.js";
import * as controller from "../controllers/paymentsController.js";
import express from "express";

const router = express.Router();

// customer triggers payment for an order
router.post('/pay', authenticate, authorize(['customer']), controller.payForOrder);
// get invoice for order
router.get('/invoice/:orderId', authenticate, controller.getInvoice);

export default router;

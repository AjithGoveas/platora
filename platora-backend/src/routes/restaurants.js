import express from "express";
import * as controller from "../controllers/restaurantsController.js";
import {authenticate, authorize} from "../middleware/auth.js";

const router = express.Router();

// Public: list restaurants
router.get('/', controller.list);
// Public: get single restaurant by id
router.get('/:id', controller.getById);
// Admin-only: create restaurant (admin creates restaurants linked to a user)
router.post('/', authenticate, authorize(['admin']), controller.create);
// Restaurant owner managing their own restaurant
router.get('/me', authenticate, authorize(['restaurant']), controller.getMyRestaurant);
router.put('/me', authenticate, authorize(['restaurant']), controller.updateMyRestaurant);
router.delete('/:id', authenticate, authorize(['admin']), controller.deleteRestaurant);

export default router;

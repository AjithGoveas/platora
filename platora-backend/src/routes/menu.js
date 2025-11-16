import express from "express";
import {authenticate, authorize} from "../middleware/auth.js";
import {create, listByRestaurant, update, remove} from "../controllers/menuController.js";

const router = express.Router();

// public: get menu for a restaurant
router.get('/restaurant/:restaurantId', listByRestaurant);
// restaurant owner manage items
router.post('/', authenticate, authorize(['restaurant']), create);
router.put('/:id', authenticate, authorize(['restaurant']), update);
router.delete('/:id', authenticate, authorize(['restaurant']), remove);

export default router;

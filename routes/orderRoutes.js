import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { createOrder, myOrders } from '../controllers/orderController.js';

const router = Router();

router.post('/', auth(), createOrder);
router.get('/mine', auth(), myOrders);

export default router;

import { Router } from 'express';
import { auth, isAdmin } from '../middleware/auth.js';
import {
  createMenuItem, updateMenuItem, deleteMenuItem,
  listReservations, updateOrderStatus, occupancy, listOrders
} from '../controllers/adminController.js';

const router = Router();


router.post('/menu', auth(), isAdmin, createMenuItem);
router.put('/menu/:id', auth(), isAdmin, updateMenuItem);
router.delete('/menu/:id', auth(), isAdmin, deleteMenuItem);


router.get('/reservations', auth(), isAdmin, listReservations);


router.get('/orders', auth(), isAdmin, listOrders);   // ✅ NEW: list all orders
router.put('/orders/:id/status', auth(), isAdmin, updateOrderStatus);

router.get('/occupancy', auth(), isAdmin, occupancy);

export default router;

import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  createReservation,
  myReservations,
  cancelReservation,
  availability
} from '../controllers/reservationController.js';

const router = Router();

router.get('/availability', auth(false), availability);
router.post('/', auth(), createReservation);
router.get('/mine', auth(), myReservations);
router.delete('/:id', auth(), cancelReservation);

export default router;

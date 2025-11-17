import express from 'express';
import { verifyJwt, requireRole } from '../middlewares/auth.middleware.js';
import { createOrder, listOrders, getOrder, getAllOrders, updateOrderStatus, confirmOrderPayment } from '../controllers/order.controller.js';

const router = express.Router();

router.use(verifyJwt);
router.post('/', createOrder);
router.get('/', listOrders);
router.get('/all', requireRole('manager'), getAllOrders);
router.patch('/:orderId/confirm-payment', confirmOrderPayment);
router.patch('/:orderId/status', requireRole('manager'), updateOrderStatus);
router.get('/:orderId', getOrder);

export default router;



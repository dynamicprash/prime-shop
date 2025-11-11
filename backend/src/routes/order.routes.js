import express from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { createOrder, listOrders, getOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.use(verifyJwt);
router.post('/', createOrder);
router.get('/', listOrders);
router.get('/:orderId', getOrder);

export default router;



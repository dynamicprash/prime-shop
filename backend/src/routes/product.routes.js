import express from 'express';
import { registerProduct, getAllProducts, getProductById } from '../controllers/product.controller.js';
import { verifyJwt, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(getAllProducts);
router.route('/add').post(verifyJwt, requireRole('manager'), registerProduct);
router.route('/:productId').get(getProductById);

export default router;
import express from 'express';
import { getProducts, searchProducts } from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/products', getProducts);
router.post('/search', protect, searchProducts);

export default router;

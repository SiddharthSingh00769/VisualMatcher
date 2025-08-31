import express from 'express';
import { addProduct, getProductById, getProducts, searchProducts } from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/products', getProducts);

router.get('/products/:id', getProductById);

router.post('/search', protect, searchProducts);

router.post('/products', protect, addProduct);

export default router;

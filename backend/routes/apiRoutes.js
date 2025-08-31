import express from 'express';
import { addProduct, getProductById, getProducts, searchProducts } from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Fetch all products
// @access  Public
router.get('/products', getProducts);

// @route   GET /api/products/:id
// @desc    Fetch a single product by ID
// @access  Public
router.get('/products/:id', getProductById);

// @route   POST /api/products/search
// @desc    Search for products based on an image
// @access  Private
router.post('/search', protect, searchProducts);

// @route   POST /api/products
// @desc    Add a new product
router.post('/products', protect, addProduct);

export default router;

import express from 'express';
import { registerUser, loginUser, logout } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);
router.get('/checkAuth', protect, (req, res) => {
    res.status(200).json({ message: 'User is authenticated' });
});

export default router;
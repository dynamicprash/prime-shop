import express from 'express';
import { loginUser, logoutUser, getCurrentUser } from '../controllers/auth.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', verifyJwt, logoutUser);
router.get('/me', verifyJwt, getCurrentUser);

export default router;



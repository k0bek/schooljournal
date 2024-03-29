import express from 'express';
const router = express.Router();
import { google, login, logout, register, verifyEmail } from '../controllers/authController';

router.post('/google', google);
router.post('/register', register);
router.post('/login', login);
router.post('/users/:id/verify/:token', verifyEmail);
router.post('/logout', logout);

export default router;

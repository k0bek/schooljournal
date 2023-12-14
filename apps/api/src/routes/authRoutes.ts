import express from 'express';
const router = express.Router();
import { google, login, register } from '../controllers/authController';

router.post('/google', google);
router.post('/register', register);
router.post('/login', login);

export default router;

import express from 'express';
const router = express.Router();
import { google } from '../controllers/authController';

router.post('/google', google);

export default router;

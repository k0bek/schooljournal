import express from 'express';
import { createClass, getClasses } from '../controllers/classController';
import { authenticateUser } from '../middleware/checkAccessTokenMiddleware';
const router = express.Router();

router.post('/createClass', authenticateUser, createClass);
router.get('/getClasses', authenticateUser, getClasses);

export default router;

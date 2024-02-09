import express from 'express';
const router = express.Router();
import { authenticateUser } from '../middleware/checkAccessTokenMiddleware';
import {
	createNotification,
	getAllNotifications,
	markReadNotification,
} from '../controllers/notificationController';

router.post('/addnotification', authenticateUser, createNotification);
router.get('/getnotification', authenticateUser, getAllNotifications);
router.patch('/markreadnotification', markReadNotification);

export default router;

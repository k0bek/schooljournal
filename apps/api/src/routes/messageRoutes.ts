import express from 'express';
const router = express.Router();
import { addMessage, getAllMessages } from './../controllers/messageController';
import { authenticateUser } from '../middleware/checkAccessTokenMiddleware';

router.post('/addmsg', authenticateUser, addMessage);
router.get('/getmsg', authenticateUser, getAllMessages);

export default router;

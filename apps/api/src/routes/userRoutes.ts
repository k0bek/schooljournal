import express from 'express';
import { showCurrentUser, updateUser } from '../controllers/userController';
import { authenticateUser } from '../middleware/checkAccessTokenMiddleware';
const router = express.Router();

router.get('/showMe', authenticateUser, showCurrentUser);
router.patch('/updateUser', updateUser);

export default router;

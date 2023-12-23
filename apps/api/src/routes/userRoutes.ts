import express from 'express';
// import { updateUser, showCurrentUser } from '../controllers/userController';
import { showCurrentUser } from '../controllers/userController';
import { authenticateUser } from '../middleware/checkAccessTokenMiddleware';
const router = express.Router();

router.get('/showMe', authenticateUser, showCurrentUser);

export default router;

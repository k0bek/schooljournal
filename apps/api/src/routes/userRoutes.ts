import express from 'express';
import {
	getAllUsers,
	showCurrentStudent,
	showCurrentUser,
	updateUser,
} from '../controllers/userController';
import { authenticateUser } from '../middleware/checkAccessTokenMiddleware';
const router = express.Router();

router.get('/showMe', authenticateUser, showCurrentUser);
router.get('/showCurrentStudent', authenticateUser, showCurrentStudent);
router.patch('/updateUser', updateUser);
router.get('/allUsers', getAllUsers);

export default router;

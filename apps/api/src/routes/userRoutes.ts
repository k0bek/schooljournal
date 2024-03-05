import express from 'express';
import {
	getAllUsers,
	showCurrentStudent,
	showCurrentTeacher,
	showCurrentUser,
	updateUser,
} from '../controllers/userController';
import { authenticateUser } from '../middleware/checkAccessTokenMiddleware';
const router = express.Router();

router.get('/showMe', authenticateUser, showCurrentUser);
router.get('/showCurrentStudent', authenticateUser, showCurrentStudent);
router.get('/showCurrentTeacher', authenticateUser, showCurrentTeacher);
router.patch('/updateUser', updateUser);
router.get('/allUsers', getAllUsers);

export default router;

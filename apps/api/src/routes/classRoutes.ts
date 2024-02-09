import express from 'express';
import {
	acceptStudent,
	createClass,
	getClasses,
	getRequestedStudents,
	requestJoinClass,
} from '../controllers/classController';
import { authenticateUser } from '../middleware/checkAccessTokenMiddleware';
const router = express.Router();

router.post('/createClass', authenticateUser, createClass);
router.get('/getClasses', authenticateUser, getClasses);
router.patch('/requestJoinClass', authenticateUser, requestJoinClass);
router.get('/getRequestedStudents', authenticateUser, getRequestedStudents);
router.patch('/acceptStudent', acceptStudent);

export default router;

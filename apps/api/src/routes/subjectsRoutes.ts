import express from 'express';
import { getSubjects } from '../controllers/subjectController';
const router = express.Router();

router.get('/getSubjects/:currentClassId', getSubjects);

export default router;

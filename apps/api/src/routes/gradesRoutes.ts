import express from 'express';
import { addGrade } from '../controllers/gradesController';
const router = express.Router();

router.post('/addGrade', addGrade);

export default router;

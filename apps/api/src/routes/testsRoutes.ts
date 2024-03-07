import express from 'express';
import { addTest, getTests } from '../controllers/testsController';
const router = express.Router();

router.post('/addTest', addTest);
router.get('/getTests', getTests);

export default router;

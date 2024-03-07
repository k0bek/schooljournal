import { Request, Response } from 'express';
import { db } from '../../../../packages/database/db';
import { StatusCodes } from 'http-status-codes';

export const addTest = async (req: Request, res: Response) => {
	const { testDate, topic, classId, subjectName, className } = req.body;
	const createdTest = await db.test.create({
		data: {
			testDate,
			topic,
			classId,
			subjectName,
			className,
		},
	});
	res.status(StatusCodes.CREATED).json({ createdTest });
};

export const getTests = async (req: Request, res: Response) => {
	const tests = await db.test.findMany({});
	res.status(StatusCodes.CREATED).json({ tests });
};

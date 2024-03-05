import { Request, Response } from 'express';
import { db } from '../../../../packages/database/db';
import { StatusCodes } from 'http-status-codes';

export const addGrade = async (req: Request, res: Response) => {
	const { studentId, grade, topic, subjectId } = req.body;
	console.log(req.body);

	const currentClass = await db.grade.create({
		data: {
			studentId,
			grade,
			topic,
			subjectId,
		},
	});

	res.status(StatusCodes.CREATED).json({ currentClass });
};

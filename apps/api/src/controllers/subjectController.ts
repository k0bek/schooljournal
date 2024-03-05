import { Request, Response } from 'express';
import { db } from '../../../../packages/database/db';
import { StatusCodes } from 'http-status-codes';

export const getSubjects = async (req: Request, res: Response) => {
	const { currentClassId } = req.query;

	console.log(currentClassId);

	const subjects = await db.subject.findMany({
		where: {
			classId: currentClassId as string,
		},
		include: {
			grades: true,
		},
	});

	res.status(StatusCodes.CREATED).json({ subjects });
};

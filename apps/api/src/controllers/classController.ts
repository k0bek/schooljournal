import { db } from '../../../../packages/database/db';
import { Request, Response } from 'express';
import BadRequestError from '../errors/bad-request';
import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

interface AuthenticatedRequest extends Request {
	user?: User;
}

export const createClass = async (req: AuthenticatedRequest, res: Response) => {
	const { className, numberOfStudents, subjects } = req.body;
	const existingClass = await db.class.findUnique({ where: { className } });
	if (existingClass) {
		throw new BadRequestError('Class with this name already exists.');
	}
	const createdClass = await db.class.create({
		data: {
			className,
			numberOfStudents,
			subjects,
			formTeacherId: req?.user?.id as string,
		},
	});
	res.status(StatusCodes.CREATED).json({ createdClass });
};

export const getClasses = async (req: AuthenticatedRequest, res: Response) => {
	const classes = await db.class.findMany({
		include: {
			formTeacher: true,
			students: true,
		},
	});
	res.status(StatusCodes.OK).json({ classes });
};

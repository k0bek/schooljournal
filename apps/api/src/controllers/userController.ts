import { Request, Response } from 'express';
import { db } from '../../../../packages/database/db';
import { StatusCodes } from 'http-status-codes';
import UnauthenticatedError from '../errors/unauthenticated';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
	user?: User | {};
}

export const updateUser = async (req: Request, res: Response) => {
	const { email, type } = req.body;
	const user = await db.user.findUnique({ where: { email } });
	if (user) {
		const updatedUser = await db.user.update({
			where: {
				email,
			},
			data: {
				...req.body,
			},
			include: {
				teacher: true,
			},
		});
		let createdUser;
		if (type === 'teacher') {
			createdUser = await db.teacher.create({
				data: {
					userId: user.id,
				},
			});
		}

		if (type === 'student') {
			createdUser = await db.student.create({
				data: {
					userId: user.id,
				},
			});
		}

		res.status(StatusCodes.CREATED).json({ updatedUser, createdUser });
	} else {
		throw new UnauthenticatedError('There is no user with this email.');
	}
};

export const showCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
	return res.status(StatusCodes.OK).json({ user: req.user });
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
	const users = await db.user.findMany({});
	return res.status(StatusCodes.OK).json({ users });
};

import { Request, Response } from 'express';
import { db } from '../../../../packages/database/db';
import { StatusCodes } from 'http-status-codes';
import UnauthenticatedError from '../errors/unauthenticated';
import { User } from '@prisma/client';
import BadRequestError from '../errors/bad-request';
var ObjectID = require('bson-objectid');

interface AuthenticatedRequest extends Request {
	user?: User;
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
					userId: ObjectID(user.id),
				},
			});
		}

		if (type === 'student') {
			createdUser = await db.student.create({
				data: {
					userId: ObjectID(user.id),
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

export const showCurrentStudent = async (req: AuthenticatedRequest, res: Response) => {
	if (!req.user?.id) {
		throw new BadRequestError('There is no user with this id.');
	}
	const currentStudent = await db.student.findUnique({
		where: {
			userId: ObjectID(req.user.id),
		},
		include: {
			class: {
				include: {
					subjects: {
						include: {
							grades: true,
						},
					},
				},
			},
			requestedClasses: true,
		},
	});

	return res.status(StatusCodes.OK).json({ currentStudent });
};

export const showCurrentTeacher = async (req: AuthenticatedRequest, res: Response) => {
	if (!req.user?.id) {
		throw new BadRequestError('There is no user with this id.');
	}
	const currentTeacher = await db.teacher.findUnique({
		where: {
			userId: ObjectID(req.user.id),
		},
		include: {
			createdClass: true,
			user: true,
		},
	});

	return res.status(StatusCodes.OK).json({ currentTeacher });
};

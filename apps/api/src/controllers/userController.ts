import { Request, Response } from 'express';
import { db } from '../../../../packages/database/db';
import { StatusCodes } from 'http-status-codes';
import UnauthenticatedError from '../errors/unauthenticated';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
	user?: User | {};
}

export const updateUser = async (req: Request, res: Response) => {
	const { email, firstName, lastName } = req.body;
	const user = await db.user.findUnique({ where: { email } });
	if (user) {
		const updatedUser = await db.user.update({
			where: {
				email,
			},
			data: {
				firstName,
				lastName,
			},
		});
		res.status(StatusCodes.OK).json({ updatedUser });
	} else {
		throw new UnauthenticatedError('There is no user with this email.');
	}
};

export const showCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
	return res.status(StatusCodes.OK).json({ user: req.user });
};

import { NextFunction, Request, Response } from 'express';
import { isTokenValid } from '../utils/jwt';
import UnauthenticatedError from '../errors/unauthenticated';
import { User } from '@prisma/client';
import { db } from '../../../../packages/database/db';

interface AuthenticatedRequest extends Request {
	user?: User | {};
}

export const authenticateUser = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	const { accessToken } = req.signedCookies;

	try {
		if (accessToken) {
			// @ts-ignore
			const { user } = await isTokenValid(accessToken);
			const updatedUser = await db.user.findUnique({
				where: { email: user.email },
				include: {
					teacher: { include: { createdClass: true } },
					student: { include: { user: true } },
				},
			});

			// @ts-ignore
			req.user = updatedUser;

			next();
		} else {
			throw new UnauthenticatedError('Access Token is missing');
		}
	} catch (error) {
		req.user = {};
		next();
	}
};

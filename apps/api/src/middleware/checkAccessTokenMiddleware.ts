import { NextFunction, Request, Response } from 'express';
import { isTokenValid } from '../utils/jwt';
import UnauthenticatedError from '../errors/unauthenticated';
import { User } from '@prisma/client';

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
			const payload = await isTokenValid(accessToken);
			// @ts-ignore
			req.user = payload.user;
			next();
		} else {
			throw new UnauthenticatedError('Access Token is missing');
		}
	} catch (error) {
		req.user = {};
		next();
	}
};
